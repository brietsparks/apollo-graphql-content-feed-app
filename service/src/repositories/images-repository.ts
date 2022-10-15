import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { imagesTable, imageTagsTable } from '../database';

import { TransactionOptions, TransactionsHelper } from './transactions';
import { CursorPaginationParams, CursorPaginationResult, makeCursorPagination } from './lib/pagination';

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
        .insert(imagesTable.toColumnCase({
          id,
          ...params,
        }));

      if (params.tagIds.length) {
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
      .select(imagesTable.rawColumns())
      .where({ [imagesTable.rawColumn('id')]: id })
      .first();
  };

  getImages = async (params: GetImagesParams): Promise<CursorPaginationResult<Image>> => {
    const pagination = makeImagesCursorPagination(params.pagination);

    const query = this.db
      .from(imagesTable.name)
      .select(imagesTable.rawColumns())
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit);

    if (params.ownerId) {
      query.andWhere({
        [imagesTable.rawColumn('ownerId')]: params.ownerId
      });
    }

    const images = await query;

    return pagination.getResult(images);
  };

  getRecentImagesByOwnerIds = async (params: GetRecentImagesByOwnerIdsParams): Promise<Image[]> => {
    return this.db.unionAll(params.ownerIds.map(
      (ownerId) => this.db
        .from(imagesTable.name)
        .select(imagesTable.rawColumns())
        .where(imagesTable.rawColumn('ownerId'), ownerId)
        .orderBy(imagesTable.rawColumn('creationTimestamp'), 'desc')
        .limit(3)
    ), true);
  };

  attachTagsToImage = async (params: AttachTagsToImageParams, opts: TransactionOptions) => {
    return this.trx.query(opts,async (trx) => {
      const insert = params.tagIds.map(tagId => imageTagsTable.toColumnCase({
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
}

export function makeImagesCursorPagination(params: Partial<CursorPaginationParams>) {
  return makeCursorPagination({
    field: params.field || imagesTable.rawColumn('creationTimestamp'),
    sortDirection: params.sortDirection || 'desc',
    limit: params.limit || 4,
    cursor: params.cursor
  });
}
