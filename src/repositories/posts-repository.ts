import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { postsTable } from '../database';

import { TransactionOptions, TransactionsHelper } from './transactions';
import { CursorPaginationParams, CursorPaginationResult, makeCursorPagination } from './pagination';

export type Post = {
  id: string;
  creationTimestamp: Date;
  ownerId: string;
  title: string;
  body: string | null;
}

export interface CreatePostParams {
  ownerId: string;
  title: string;
  body?: string | null;
}

export interface GetPostsParams {
  pagination: Partial<CursorPaginationParams<Post>>;
  ownerId?: string;
}

export interface GetPostsByOwnerIdsParams {
  ownerIds: string[]
}

export interface SearchPostsParams {
  term: string;
  pagination: Partial<CursorPaginationParams<Post>>;
}

export class PostsRepository {
  private trx: TransactionsHelper;

  constructor(
    private db: Knex
  ) {
    this.trx = new TransactionsHelper(db);
  }

  createPost = async (params: CreatePostParams, opts: TransactionOptions) => {
    return this.trx.query(opts, (async (trx) => {
      const id = uuid();

      await trx
        .into(postsTable.name)
        .insert(postsTable.writeColumns({
          id,
          ...params,
        }));

      return { id };
    }));
  };

  getPost = async (id: string) => {
    return this.db
      .from(postsTable.name)
      .select(postsTable.columns)
      .where({ [postsTable.columns.id]: id })
      .first();
  };

  getPosts = async (params: GetPostsParams): Promise<CursorPaginationResult<Post>> => {
    const pagination = makePostsCursorPagination(params.pagination);

    const query = this.db
      .from(postsTable.name)
      .select(postsTable.columns)
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit);

    if (params.ownerId) {
      query.andWhere({
        [postsTable.columns.ownerId]: params.ownerId
      });
    }

    const posts = await query;

    return pagination.getResult(posts);
  };

  getPostsByOwnerIds = async (params: GetPostsByOwnerIdsParams): Promise<Post[]> => {
    return this.db
      .from(postsTable.name)
      .select(postsTable.columns)
      .whereIn(postsTable.columns.ownerId, params.ownerIds);
  };

  searchPosts = async (params: SearchPostsParams) => {
    const pagination = makePostsCursorPagination(params.pagination);

    const posts = await this.db
      .from(postsTable.name)
      .select(postsTable.columns)
      .whereLike(postsTable.columns.title, `%${params.term}%`)
      .andWhere(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit);

    return pagination.getResult(posts);
  };
}

export function makePostsCursorPagination(params: Partial<CursorPaginationParams<Post>>) {
  const defaultParams: CursorPaginationParams<Post> = {
    field: 'creationTimestamp',
    sortDirection: 'desc',
    limit: 10,
    fieldmap: postsTable.columns,
  };

  return makeCursorPagination<Post>({
    ...defaultParams,
    ...params,
  });
}
