import { Knex } from 'knex';

import { postsTable, imagesTable } from '../database';

import { CursorPaginationParams, CursorPaginationResult, makeCursorPagination } from './pagination';
import { Post } from './posts-repository';
import { Image } from './images-repository';

export type ContentItem = Post | Image;

export interface GetContentItemsParams {
  pagination: Partial<CursorPaginationParams<ContentItem>>;
  ownerId?: string;
}

export class ContentItemsRepository {
  constructor(
    private db: Knex
  ) {}

  getContentItems = async (params: GetContentItemsParams): Promise<CursorPaginationResult<ContentItem>> => {
    const pagination = makeContentItemsCursorPagination(params.pagination);

    const query = this.db
      .from(postsTable.name)
      .select({
        ...postsTable.prefixedColumns.all,
        ...imagesTable.prefixedColumns.all,
      })
      .fullOuterJoin(
        imagesTable.name,
        postsTable.prefixedColumns.get('id'),
        imagesTable.prefixedColumns.get('id')
      )
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit)

    if (params.ownerId) {
      query.andWhere(q => q
        .orWhere({ [postsTable.prefixedColumns.get('ownerId')]: params.ownerId })
        .orWhere({ [imagesTable.prefixedColumns.get('ownerId')]: params.ownerId })
      );
    }

    console.log(query.toSQL().sql);

    // const contentItems = await query;

    // console.log({ contentItems });
    //
    // return pagination.getResult(contentItems);

    return {} as any;
  };
}

export function makeContentItemsCursorPagination(params: Partial<CursorPaginationParams<ContentItem>>) {
  const defaultParams: CursorPaginationParams<ContentItem> = {
    field: 'creationTimestamp',
    sortDirection: 'desc',
    limit: 10,
    // fieldmap: { ...imagesTable.prefixedColumns.all, ...postsTable.prefixedColumns.all }, // todo
  };

  return makeCursorPagination<ContentItem>({
    ...defaultParams,
    ...params,
  });
}
