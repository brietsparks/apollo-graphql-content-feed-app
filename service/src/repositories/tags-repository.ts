import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { tagsTable, postTagsTable, imageTagsTable } from '../database';

import { TransactionOptions, TransactionsHelper } from './transactions';
import { CursorPaginationParams, makeCursorPagination } from './lib/pagination';
import { CursorPaginationResult } from './shared';

export type Tag = {
  id: string;
  creationTimestamp: Date;
  name: string;
}

export type PostTag =
  Tag & {
  postId: string;
}

export type ImageTag =
  Tag & {
  imageId: string;
}

export interface CreateTagParams {
  name: string;
}

export interface GetTagsParams {
  pagination: Partial<CursorPaginationParams<keyof Tag>>;
}

export interface SearchTagsParams {
  term: string;
  pagination: Partial<CursorPaginationParams<keyof Tag>>;
}

export class TagsRepository {
  private trx: TransactionsHelper;

  constructor(
    private db: Knex
  ) {
    this.trx = new TransactionsHelper(db);
  }

  createTag = async (params: CreateTagParams, opts: TransactionOptions) => {
    return this.trx.query(opts, (async (trx) => {
      const id = uuid();

      await trx
        .into(tagsTable.name)
        .insert(tagsTable.toColumnCase({
          id,
          ...params,
        }));

      return { id };
    }));
  };

  getTag = async (id: string) => {
    return this.db
      .from(tagsTable.name)
      .select(tagsTable.rawColumns())
      .where({ [tagsTable.rawColumn('id')]: id })
      .first();
  };

  getTags = async (params: GetTagsParams): Promise<CursorPaginationResult<Tag>> => {
    const pagination = makeTagsCursorPagination(params.pagination);

    const rows = await this.db
      .from(tagsTable.name)
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit)
      .select(tagsTable.prefixedColumns());

    return {
      items: pagination.getRows(rows),
      cursors: pagination.getCursors(rows),
    };
  }

  searchTags = async (params: SearchTagsParams): Promise<CursorPaginationResult<Tag>> => {
    const pagination = makeTagsCursorPagination(params.pagination);

    const rows = await this.db
      .from(tagsTable.name)
      .where(tagsTable.rawColumn('name'), 'like', `%${params.term}%`)
      .andWhere(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit)
      .select(tagsTable.rawColumns());

    return {
      items: pagination.getRows(rows),
      cursors: pagination.getCursors(rows),
    };
  }

  getTagsOfPosts = async (postIds: string[]): Promise<PostTag[]> => {
    const rows = await this.db
      .from(tagsTable.name)
      .innerJoin(
        postTagsTable.name,
        postTagsTable.prefixedColumn('tagId'),
        tagsTable.prefixedColumn('id')
      )
      .select(tagsTable.prefixedColumns())
      .select(postTagsTable.prefixedColumns())
      .whereIn(postTagsTable.prefixedColumn('postId'), postIds)
      .orderBy(postTagsTable.prefixedColumn('creationTimestamp'));

    return rows.map(row => {
      const tag = tagsTable.toAttributeCase(row);
      const { postId } = postTagsTable.toAttributeCase(row);
      return { ...tag, postId } as PostTag;
    });
  };

  getTagsOfImages = async (imageIds: string[]): Promise<ImageTag[]> => {
    const rows = await this.db
      .from(tagsTable.name)
      .innerJoin(
        imageTagsTable.name,
        imageTagsTable.prefixedColumn('tagId'),
        tagsTable.prefixedColumn('id')
      )
      .select(tagsTable.prefixedColumns())
      .select(imageTagsTable.prefixedColumns())
      .whereIn(imageTagsTable.prefixedColumn('imageId'), imageIds)
      .orderBy(imageTagsTable.prefixedColumn('creationTimestamp'));

    return rows.map(row => {
      const tag = tagsTable.toAttributeCase(row);
      const { imageId } = imageTagsTable.toAttributeCase(row);
      return { ...tag, imageId } as ImageTag;
    });
  };
}

export function makeTagsCursorPagination(params: Partial<CursorPaginationParams<keyof Tag>> = {}) {
  return makeCursorPagination({
    field: tagsTable.prefixedColumn(params.field || 'creationTimestamp'),
    direction: params.direction || 'desc',
    limit: params.limit || 12,
    cursor: params.cursor,
  });
}
