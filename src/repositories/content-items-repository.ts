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
          ${postsTable.column('creationTimestamp')},
          ${imagesTable.prefixedColumns.get('creationTimestamp')}
        ) as creation_timestamp`
      ))
      .select(
        postsTable.columns(),
        { ...imagesTable.prefixedColumns.all }
      )
      .fullOuterJoin(
        imagesTable.name,
        postsTable.column('id'),
        imagesTable.prefixedColumns.get('id')
      )
      .where(...pagination.where)
      .orderBy(1, params.pagination.sortDirection || 'desc')
      .limit(pagination.limit)

    if (params.ownerId) {
      query.andWhere(q => q
        .orWhere({ [postsTable.column('ownerId')]: params.ownerId })
        .orWhere({ [imagesTable.prefixedColumns.get('ownerId')]: params.ownerId })
      );
    }

    const rows = await query;

    const contentItems = rows
      .map((item) => {
        if (item[postsTable.column('id')]) {
          return {
            ...postsTable.toAttributeCase(item),
            _type: 'post'
          };
        }
        if (item[imagesTable.prefixedColumns.get('id')]) {
          return {
            ...imagesTable.prefixedColumns.unmarshal(item),
            _type: 'image'
          };
        }
        return null;
      })
      .filter(item => !!item);

    return pagination.getResult(contentItems as ContentItem[]);
  };
}
