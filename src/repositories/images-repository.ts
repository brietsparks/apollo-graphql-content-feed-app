import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { imagesTable } from '../database';

import { TransactionOptions, TransactionsHelper } from './transactions';
import { CursorPaginationParams, CursorPaginationResult, makeCursorPagination } from './pagination';

export type Image = {
  id: string;
  creationTimestamp: Date;
  ownerId: string;
  url: string;
  caption: string | null;
}

export interface CreateImageParams {
  ownerId: string;
  url: string;
  caption?: string | null;
}

export interface GetImagesParams {
  pagination: Partial<CursorPaginationParams<Image>>;
  ownerId?: string;
}

export interface GetRecentImagesByOwnerIdsParams {
  ownerIds: string[];
  limit?: number;
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
        .insert(imagesTable.writeColumns({
          id,
          ...params,
        }));

      return { id };
    }));
  };

  getImage = async (id: string) => {
    return this.db
      .from(imagesTable.name)
      .select(imagesTable.columns)
      .where({ [imagesTable.columns.id]: id })
      .first();
  };

  getImages = async (params: GetImagesParams): Promise<CursorPaginationResult<Image>> => {
    const pagination = makeImagesCursorPagination(params.pagination);

    const query = this.db
      .from(imagesTable.name)
      .select(imagesTable.columns)
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit);

    if (params.ownerId) {
      query.andWhere({
        [imagesTable.columns.ownerId]: params.ownerId
      });
    }

    const images = await query;

    return pagination.getResult(images);
  };

  getRecentImagesByOwnerIds = async (params: GetRecentImagesByOwnerIdsParams): Promise<Image[]> => {
    return this.db.unionAll(params.ownerIds.map(
      (ownerId) => this.db
        .from(imagesTable.name)
        .select(imagesTable.columns)
        .where(imagesTable.columns.ownerId, ownerId)
        .orderBy(imagesTable.columns.creationTimestamp, 'desc')
        .limit(3)
    ), true);
  };
}

export function makeImagesCursorPagination(params: Partial<CursorPaginationParams<Image>>) {
  const defaultParams: CursorPaginationParams<Image> = {
    field: 'creationTimestamp',
    sortDirection: 'desc',
    limit: 10,
    fieldmap: imagesTable.columns,
  };

  return makeCursorPagination<Image>({
    ...defaultParams,
    ...params,
  });
}
