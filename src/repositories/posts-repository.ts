import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { postsTable, postTagsTable } from '../database';

import { TransactionOptions, TransactionsHelper } from './transactions';
import { CursorPaginationParams, CursorPaginationResult, makeCursorPagination } from './lib/pagination';
// import { CursorPaginationParams, CursorPaginationResult, makeCursorPagination } from './pagination';

export type Post = {
  id: string;
  creationTimestamp: Date;
  ownerId: string;
  title: string;
  body: string | null;
}

export interface CreatePostParams {
  ownerId: string;
  tagIds?: string[];
  title: string;
  body?: string | null;
}

export interface GetPostsParams {
  pagination?: Partial<CursorPaginationParams<keyof Post>>;
  ownerId?: string;
  tagId?: string;
}

export interface GetRecentPostsByOwnerIdsParams {
  ownerIds: string[];
  limit?: number;
}

export interface AttachTagsToPostParams {
  tagIds: string[];
  postId: string;
}

export class PostsRepository {
  private trx: TransactionsHelper;

  constructor(private db: Knex) {
    this.trx = new TransactionsHelper(db);
  }

  createPost = async (params: CreatePostParams, opts: TransactionOptions) => {
    return this.trx.query(opts, async (trx) => {
      const id = uuid();

      await trx
        .into(postsTable.name)
        .insert(postsTable.toColumnCase({
          id,
          ownerId: params.ownerId,
          title: params.title,
          body: params.body,
        }));

      if (params.tagIds) {
        await this.attachTagsToPost({
          postId: id,
          tagIds: params.tagIds
        }, { ...opts, trx });
      }

      return { id };
    });
  };

  getPost = async (id: string): Promise<Post> => {
    return this.db
      .from(postsTable.name)
      .select(postsTable.rawColumns())
      .where({ [postsTable.rawColumn('id')]: id })
      .first();
  };

  getPosts = async (params: GetPostsParams): Promise<CursorPaginationResult<Post>> => {
    const pagination = makePostsCursorPagination(params.pagination);

    const query = this.db
      .from(postsTable.name)
      .select(postsTable.prefixedColumns())
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit);

    if (params.ownerId) {
      query.andWhere({
        [postsTable.prefixedColumn('ownerId')]: params.ownerId
      });
    }

    if (params.tagId) {
      query
        .innerJoin(
          postTagsTable.name,
          postTagsTable.prefixedColumns.get('postId'),
          postsTable.prefixedColumn('id')
        )
        .andWhere({
          [postTagsTable.prefixedColumns.get('tagId')]: params.tagId
        });
    }

    const rows = await query;
    const paginationResult = pagination.getResult(rows);
    const posts = paginationResult.items.map(paginatedRow => postsTable.toAttributeCase<Post>(paginatedRow));
    return {
      items: posts,
      cursors: paginationResult.cursors
    };
  };

  getRecentPostsByOwnerIds = async (params: GetRecentPostsByOwnerIdsParams): Promise<Post[]> => {
    return this.db.unionAll(params.ownerIds.map(
      (ownerId) => this.db
        .from(postsTable.name)
        .select(postsTable.prefixedColumns())
        .where(postsTable.prefixedColumn('ownerId'), ownerId)
        .orderBy(postsTable.prefixedColumn('creationTimestamp'), 'desc')
        .limit(3)
    ), true);
  };

  attachTagsToPost = async (params: AttachTagsToPostParams, opts: TransactionOptions) => {
    return this.trx.query(opts,async (trx) => {
      const insert = params.tagIds.map(tagId => postTagsTable.writeColumns({
        id: uuid(),
        tagId,
        postId: params.postId,
      }));

      await trx
        .into(postTagsTable.name)
        .insert(insert);

      return insert.map(row => row.id);
    });
  };
}

export function makePostsCursorPagination(params: Partial<CursorPaginationParams<keyof Post>> = {}) {
  return makeCursorPagination({
    field: postsTable.prefixedColumn(params.field || 'creationTimestamp'),
    sortDirection: params.sortDirection || 'desc',
    limit: params.limit || 4,
    cursor: params.cursor,
  });
}
