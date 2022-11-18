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
    const innerPostsTable = postsTable;
    const outerPostsTable = postsTable.wrap();
    const innerImagesTable = imagesTable;
    const outerImagesTable = imagesTable.wrap();

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
          .fullOuterJoin(
            imagesTable.name,
            innerPostsTable.predicate('id'),
            innerImagesTable.predicate('id')
          )
          .select(
            this.db.raw(
              `coalesce(
                ${innerPostsTable.column('creationTimestamp')},
                ${innerImagesTable.column('creationTimestamp')}
              ) as ${cursorField}`
            )
          )
          .select({
            ...innerPostsTable.select('*'),
            ...innerImagesTable.select('*'),
          })
          .as('subquery')
      })
      .select(cursorField, {
        ...outerPostsTable.select('*'),
        ...outerImagesTable.select('*')
      })
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit);

    if (params.ownerId) {
      query.andWhere(q => q
        .orWhere({ [outerPostsTable.predicate('ownerId')]: params.ownerId })
        .orWhere({ [outerImagesTable.predicate('ownerId')]: params.ownerId })
      );
    }

    const rows = await query;

    const paginatedRows = pagination.getRows(rows);

    const items: ContentItem[] = [];
    for (const row of paginatedRows) {
      if (row[outerPostsTable.prefixedAlias('id')]) {
        items.push({
          _type: 'post',
          ...outerPostsTable.toAlias(row),
        });
      } else if (row[outerImagesTable.prefixedAlias('id')]) {
        items.push({
          _type: 'image',
          ...outerImagesTable.toAlias(row),
        });
      }
    }

    return {
      items,
      cursors: pagination.getCursors(rows)
    };
  };
}
