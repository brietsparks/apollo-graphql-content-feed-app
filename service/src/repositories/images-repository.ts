import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { imagesTable, imageTagsTable } from '../database';

import { TransactionOptions, TransactionsHelper } from './transactions';
import { CursorPaginationParams, makeCursorPagination } from './lib/pagination';
import { CursorPaginationResult } from './shared';

export type Image = {
  id: string;
  creationTimestamp: Date;
  ownerId: string;
  url: string;
  caption: string | null;
}

export interface CreateImageParams {
  ownerId: string;
  tagIds?: string[];
  url: string;
  caption?: string | null;
}

export interface GetImagesParams {
  pagination: Partial<CursorPaginationParams<keyof Image>>;
  ownerId?: string;
}

export interface GetRecentImagesByOwnerIdsParams {
  ownerIds: string[];
  limit?: number;
}

export interface AttachTagsToImageParams {
  tagIds: string[];
  imageId: string;
}

export interface GetRecentImagesOfTagsParams {
  tagIds: string[];
}

export class ImagesRepository {
  private trx: TransactionsHelper;

  constructor(
    private db: Knex
  ) {
    this.trx = new TransactionsHelper(db);
  }

  createImage = async (params: CreateImageParams, opts: TransactionOptions) => {
    return this.trx.query(opts, (async (trx) => {
      const id = uuid();

      await trx
        .into(imagesTable.name)
        .insert(imagesTable.insert({
          id,
          ...params,
        }));

      if (params.tagIds?.length) {
        await this.attachTagsToImage({
          imageId: id,
          tagIds: params.tagIds
        }, { ...opts, trx });
      }

      return { id };
    }));
  };

  getImage = async (id: string) => {
    return this.db
      .from(imagesTable.name)
      .select(imagesTable.select('*'))
      .where({ [imagesTable.predicate('id')]: id })
      .first();
  };

  getImages = async (params: GetImagesParams): Promise<CursorPaginationResult<Image>> => {
    const pagination = makeImagesCursorPagination(params.pagination);

    const query = this.db
      .from(imagesTable.name)
      .select(imagesTable.select('*'))
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit);

    if (params.ownerId) {
      query.andWhere({
        [imagesTable.predicate('ownerId')]: params.ownerId
      });
    }

    const rows = await query;

    return {
      items: pagination.getRows(rows).map<Image>(imagesTable.toAlias),
      cursors: pagination.getCursors(rows)
    }
  };

  getRecentImagesByOwnerIds = async (params: GetRecentImagesByOwnerIdsParams): Promise<Image[]> => {
    return this.db.unionAll(params.ownerIds.map(
      (ownerId) => this.db
        .from(imagesTable.name)
        .select(imagesTable.select('*'))
        .where(imagesTable.predicate('ownerId'), ownerId)
        .orderBy(imagesTable.predicate('creationTimestamp'), 'desc')
        .limit(3)
    ), true);
  };

  attachTagsToImage = async (params: AttachTagsToImageParams, opts: TransactionOptions) => {
    return this.trx.query(opts,async (trx) => {
      const insert = params.tagIds.map(tagId => imageTagsTable.insert({
        id: uuid(),
        tagId,
        imageId: params.imageId,
      }));

      await trx
        .into(imageTagsTable.name)
        .insert(insert);

      return insert.map(row => row.id);
    });
  };

  getRecentImagesOfTags = async (params: GetRecentImagesOfTagsParams): Promise<Record<string, Image[]>> => {
    const rows = await this.db.unionAll(params.tagIds.map(
      (tagId) => this.db
        .from(imagesTable.name)
        .innerJoin(
          imageTagsTable.name,
          imageTagsTable.predicate('imageId'),
          imagesTable.predicate('id')
        )
        .select({
          ...imagesTable.select('*'),
          ...imageTagsTable.select('tagId'),
        })
        .where(imageTagsTable.predicate('tagId'), tagId)
        .orderBy(imagesTable.predicate('creationTimestamp'), 'desc')
        .limit(3)
    ), true);

    const imagesOfTags: Record<string, Image[]> = {};

    for (const row of rows) {
      const image = imagesTable.toAlias<Image>(row);
      const tagId = imageTagsTable.toAlias<{ tagId: string }>(row).tagId;
      if (!imagesOfTags[tagId]) {
        imagesOfTags[tagId] = [];
      }
      imagesOfTags[tagId].push(image)
    }

    return imagesOfTags;
  };
}

export function makeImagesCursorPagination(params: Partial<CursorPaginationParams<keyof Image>>) {
  return makeCursorPagination({
    field: imagesTable.predicate(
      // params.field ||
      'creationTimestamp'
    ),
    direction: params.direction || 'desc',
    limit: params.limit || 4,
    cursor: params.cursor
  });
}
