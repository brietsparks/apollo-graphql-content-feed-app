import { Knex } from 'knex';

import { postsTable, imagesTable } from '../database';
import { XOR } from '../util/types';

import { CursorPaginationParams, makeCursorPagination } from './lib/pagination';
import { CursorPaginationResult } from './shared';
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
      direction: 'desc',
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
          .fullOuterJoin(
            imagesTable.name,
            postsTable.prefixedColumn('id'),
            imagesTable.prefixedColumn('id')
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

    const paginatedRows = pagination.getRows(rows);

    const items: ContentItem[] = [];
    for (const row of paginatedRows) {
      if (row['posts:id']) {
        items.push({
          _type: 'post',
          'id': row['posts:id'],
          'creationTimestamp': row[cursorField],
          'ownerId': row['posts:ownerId'],
          'title': row['posts:title'],
          'body': row['posts:body'],
        });
      } else if (row['images:id']) {
        items.push({
          _type: 'image',
          'id': row['images:id'],
          'creationTimestamp': row[cursorField],
          'ownerId': row['images:ownerId'],
          'url': row['images:url'],
          'caption': row['images:caption'],
        });
      }
    }

    return {
      items,
      cursors: pagination.getCursors(rows)
    };
  };
}
