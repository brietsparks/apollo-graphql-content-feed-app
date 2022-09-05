import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { postsTable, postTagsTable } from '../database';

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
  tagIds?: string[];
  title: string;
  body?: string | null;
}

export interface GetPostsParams {
  pagination: Partial<CursorPaginationParams<Post>>;
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
        .insert(postsTable.writeColumns({
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
      .select(postsTable.columns)
      .where({ [postsTable.columns.id]: id })
      .first();
  };

  getPosts = async (params: GetPostsParams): Promise<CursorPaginationResult<Post>> => {
    const pagination = makePostsCursorPagination(params.pagination);

    const query = this.db
      .from(postsTable.name)
      .select(postsTable.prefixedColumns.all)
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit);

    if (params.ownerId) {
      query.andWhere({
        [postsTable.prefixedColumns.get('ownerId')]: params.ownerId
      });
    }

    if (params.tagId) {
      query
        .innerJoin(
          postTagsTable.name,
          postTagsTable.prefixedColumns.get('postId'),
          postsTable.prefixedColumns.get('id')
        )
        .andWhere({
          [postTagsTable.prefixedColumns.get('tagId')]: params.tagId
        });
    }

    const rows = await query;
    const posts = rows.map(row => postsTable.prefixedColumns.unmarshal(row) as Post);
    return pagination.getResult(posts);
  };

  getRecentPostsByOwnerIds = async (params: GetRecentPostsByOwnerIdsParams): Promise<Post[]> => {
    return this.db.unionAll(params.ownerIds.map(
      (ownerId) => this.db
        .from(postsTable.name)
        .select(postsTable.columns)
        .where(postsTable.columns.ownerId, ownerId)
        .orderBy(postsTable.columns.creationTimestamp, 'desc')
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

export function makePostsCursorPagination(params: Partial<CursorPaginationParams<Post>>) {
  const defaultParams: CursorPaginationParams<Post> = {
    // @ts-ignore
    field: postsTable.prefixedColumns.get('creationTimestamp'),
    sortDirection: 'desc',
    limit: 10,
    // @ts-ignore
    fieldmap: postsTable.prefixedColumns.all,
  };

  return makeCursorPagination<Post>({
    ...defaultParams,
    ...params,
  });
}
