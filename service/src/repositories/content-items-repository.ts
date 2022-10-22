import { Knex } from 'knex';

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
    const cursorField = '_creation_timestamp';

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
            // ...postsTable.prefixedColumns(),
            // ...imagesTable.prefixedColumns()


            // alias must cannot use a "." for separator because the outer query will parse it as table and column
            'posts:id': 'posts.id',
            'posts:creationTimestamp': 'posts.creation_timestamp',
            'posts:ownerId': 'posts.owner_id',
            'posts:title': 'posts.title',
            'posts:body': 'posts.body',
            'images:id': 'images.id',
            'images:creationTimestamp': 'images.creation_timestamp',
            'images:ownerId': 'images.owner_id',
            'images:url': 'images.url',
            'images:caption': 'images.caption',
          })
          .fullOuterJoin(
            imagesTable.name,
            postsTable.prefixedColumn('id'),
            imagesTable.prefixedColumn('id')
          )
          .as('subquery')
      })
      .select(
        cursorField,
        'posts:id',
        'posts:creationTimestamp',
        'posts:ownerId',
        'posts:title',
        'posts:body',
        'images:id',
        'images:creationTimestamp',
        'images:ownerId',
        'images:url',
        'images:caption',

        // Object.values({
        //   ...postsTable.prefixedColumns(),
        //   ...imagesTable.prefixedColumns()
        // })
      )
      .where(...pagination.where)

      // raw is needed because orderBy will wrap the identifier in quotes, which will make the subquery alias field unrecognized
      .orderByRaw(`${cursorField} desc`) // todo: escape via bindings
      .limit(pagination.limit);

    if (params.ownerId) {
      query.andWhere(q => q
        .orWhere({ 'posts:ownerId': params.ownerId })
        .orWhere({ 'images:ownerId': params.ownerId })
      );
    }

    const rows = await query;

    return pagination.getResult(rows, (item) => {
      if (item['posts:id']) {
        return {
          _type: 'post',
          'id': item['posts:id'],
          'creationTimestamp': item[cursorField],
          'ownerId': item['posts:ownerId'],
          'title': item['posts:title'],
          'body': item['posts:body'],
        };
      }
      if (item['images:id']) {
        return {
          _type: 'image',
          'id': item['images:id'],
          'creationTimestamp': item[cursorField],
          'ownerId': item['images:ownerId'],
          'url': item['images:url'],
          'caption': item['images:caption'],
        };
      }

      return null;
    });
  };
}
