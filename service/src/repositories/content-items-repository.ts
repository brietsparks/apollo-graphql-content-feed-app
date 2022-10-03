import { Knex } from 'knex';

import { postsTable, imagesTable } from '../database';
import { XOR } from '../util/types';

import { CursorPaginationParams, CursorPaginationResult, makeCursorPagination } from './pagination';
import { Post } from './posts-repository';
import { Image } from './images-repository';

export type ContentItem = XOR<
  Post & { _type: 'post' },
  Image & { _type: 'image' }
>;

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
          ${postsTable.prefixedColumn('creationTimestamp')},
          ${imagesTable.prefixedColumn('creationTimestamp')}
        ) as creation_timestamp`
      ))
      .select(
        postsTable.prefixedColumns(),
        { ...imagesTable.prefixedColumns() }
      )
      .fullOuterJoin(
        imagesTable.name,
        postsTable.prefixedColumn('id'),
        imagesTable.prefixedColumn('id')
      )
      .where(...pagination.where)
      .orderBy(1, params.pagination.sortDirection || 'desc')
      .limit(pagination.limit)

    if (params.ownerId) {
      query.andWhere(q => q
        .orWhere({ [postsTable.prefixedColumn('ownerId')]: params.ownerId })
        .orWhere({ [imagesTable.prefixedColumn('ownerId')]: params.ownerId })
      );
    }

    const rows = await query;

    const contentItems = rows
      .map((item) => {
        if (item[postsTable.prefixedColumn('id')]) {
          return {
            ...postsTable.toAttributeCase(item),
            _type: 'post'
          };
        }
        if (item[imagesTable.prefixedColumn('id')]) {
          return {
            ...imagesTable.toAttributeCase(item),
            _type: 'image'
          };
        }
        return null;
      })
      .filter(item => !!item);

    return pagination.getResult(contentItems as ContentItem[]);
  };
}
