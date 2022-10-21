import { Knex, knex } from 'knex';

import { postsTable, imagesTable } from '../database';
import { XOR } from '../util/types';

import { CursorPaginationParams, CursorPaginationResult, makeCursorPagination } from './lib/pagination';
import { Post } from './posts-repository';
import { Image } from './images-repository';

export type ContentItem = XOR<
  Post & { _type: 'post' },
  Image & { _type: 'image' }
>;

export interface GetContentItemsParams {
  pagination: Partial<CursorPaginationParams<keyof ContentItem>>;
  ownerId?: string;
}

export class ContentItemsRepository {
  constructor(
    private db: Knex
  ) {}

  getContentItems = async (params: GetContentItemsParams): Promise<CursorPaginationResult<ContentItem>> => {
    const cursorField = 'creation_timestamp';

    const pagination = makeCursorPagination({
      field: cursorField,
      sortDirection: 'desc',
      limit: params.pagination.limit || 4,
      cursor: params.pagination.cursor
    });

    const query = this.db
      .from((db: Knex) => {
        db.from(postsTable.name)
          .select(
            this.db.raw(
              `coalesce(
                ${postsTable.prefixedColumn('creationTimestamp')},
                ${imagesTable.prefixedColumn('creationTimestamp')}
              ) as ${cursorField}`
            )
          )
          .select({
            ...postsTable.prefixedColumns(),
            ...imagesTable.prefixedColumns()
          })
          .fullOuterJoin(
            imagesTable.name,
            postsTable.prefixedColumn('id'),
            imagesTable.prefixedColumn('id')
          )
          .as('subquery')
      })
      .select(Object.values({
        ...postsTable.prefixedColumns(),
        ...imagesTable.prefixedColumns()
      }))
      .where(...pagination.where)
      .orderBy(cursorField, params.pagination.sortDirection || 'desc')
      .limit(pagination.limit);

    console.log('====================================')
    console.log(query.toSQL().sql);
    console.log('====================================')


    if (params.ownerId) {
      query.andWhere(q => q
        .orWhere({ [postsTable.prefixedColumn('ownerId')]: params.ownerId })
        .orWhere({ [imagesTable.prefixedColumn('ownerId')]: params.ownerId })
      );
    }

    const rows = await query;

    const r = pagination.getResult(rows, (item) => {
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

      throw new Error();
    });

    console.log(r)

    return r;
  };
}
