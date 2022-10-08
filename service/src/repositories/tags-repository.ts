import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { tagsTable, postTagsTable } from '../database';

import { TransactionOptions, TransactionsHelper } from './transactions';
import { CursorPaginationParams, CursorPaginationResult, makeCursorPagination } from './lib/pagination';

export type Tag = {
  id: string;
  creationTimestamp: Date;
  name: string;
}

export type PostTag =
  Tag & {
  postId: string;
}

export interface CreateTagParams {
  name: string;
}

export interface SearchTagsParams {
  term: string;
  pagination: Partial<CursorPaginationParams<keyof Tag>>;
}

export type SearchTagsResult = CursorPaginationResult<Tag>;

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

  getTags = async (ids: string[]) => {
    return this.db
      .from(tagsTable.name)
      .select(tagsTable.rawColumns())
      .whereIn(tagsTable.rawColumn('id'), ids);
  }

  getAllTags = async (): Promise<Tag[]> => {
    return this.db
      .from(tagsTable.name)
      .select(tagsTable.rawColumns())
  };

  searchTags = async (params: SearchTagsParams): Promise<SearchTagsResult> => {
    const pagination = makeTagsCursorPagination({
      field: 'name',
      sortDirection: 'asc',
      ...params.pagination
    });

    const rows = await this.db
      .from(tagsTable.name)
      .where(tagsTable.rawColumn('name'), 'like', `%${params.term}%`)
      .andWhere(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit)
      .select(tagsTable.rawColumns());

    return pagination.getResult(rows);
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
}

export function makeTagsCursorPagination(params: Partial<CursorPaginationParams<keyof Tag>> = {}) {
  return makeCursorPagination({
    field: tagsTable.prefixedColumn(params.field || 'creationTimestamp'),
    sortDirection: params.sortDirection || 'desc',
    limit: params.limit || 4,
    cursor: params.cursor,
  });
}
