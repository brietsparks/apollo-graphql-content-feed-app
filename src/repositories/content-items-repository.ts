import { Knex } from 'knex';

import { postsTable, imagesTable } from '../database';
import { XOR } from '../util/types';

import { CursorPaginationParams, CursorPaginationResult, makeCursorPagination } from './pagination';
import { Post } from './posts-repository';
import { Image } from './images-repository';

export type ContentItem = XOR<Post, Image>;

export interface GetContentItemsParams {
  pagination: Partial<CursorPaginationParams<ContentItem>>;
  ownerId?: string;
}

export class ContentItemsRepository {
  constructor(
    private db: Knex
  ) {}

  getContentItems = async (params: GetContentItemsParams): Promise<CursorPaginationResult<ContentItem>> => {
    const pagination = makeCursorPagination<ContentItem>({
      ...params,
      sortDirection: 'desc',
      limit: params.pagination.limit || 10,
      field: 'creationTimestamp'
    });

    const query = this.db
      .from(postsTable.name)
      .select(this.db.raw(
        `coalesce(
          ${postsTable.prefixedColumns.get('creationTimestamp')},
          ${imagesTable.prefixedColumns.get('creationTimestamp')}
        ) as creation_timestamp`
      ))
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
      .orderBy(1, params.pagination.sortDirection)
      .limit(pagination.limit)

    if (params.ownerId) {
      query.andWhere(q => q
        .orWhere({ [postsTable.prefixedColumns.get('ownerId')]: params.ownerId })
        .orWhere({ [imagesTable.prefixedColumns.get('ownerId')]: params.ownerId })
      );
    }

    const rows = await query;

    const contentItems = rows
      .map((item) => {
        if (item[postsTable.prefixedColumns.get('id')]) {
          return postsTable.prefixedColumns.unmarshal(item);
        }
        if (item[imagesTable.prefixedColumns.get('id')]) {
          return imagesTable.prefixedColumns.unmarshal(item);
        }
        return null;
      })
      .filter(item => !!item);

    return pagination.getResult(contentItems as ContentItem[]);
  };
}
