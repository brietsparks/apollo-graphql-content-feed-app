import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { postsTable, postTagsTable } from '../database';

import { TransactionOptions, TransactionsHelper } from './transactions';
import { CursorPaginationParams, makeCursorPagination } from './lib/pagination';
import { CursorPaginationResult } from './shared';

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

export interface GetRecentPostsByTagsIdsParams {
  tagIds: string[];
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
        .insert(postsTable.insert({
          id,
          ownerId: params.ownerId,
          title: params.title,
          body: params.body,
        }));

      if (params.tagIds?.length) {
        await this.attachTagsToPost({
          postId: id,
          tagIds: params.tagIds
        }, { ...opts, trx });
      }

      return { id };
    });
  };

  getPost = async (id: string): Promise<Post> => {
    const row = await this.db
      .from(postsTable.name)
      .select(postsTable.select('*'))
      .where({ [postsTable.predicate('id')]: id })
      .first();

    return postsTable.toAlias<Post>(row);
  };

  getPosts = async (params: GetPostsParams): Promise<CursorPaginationResult<Post>> => {
    const pagination = makePostsCursorPagination(params.pagination);

    const query = this.db
      .from(postsTable.name)
      .select(postsTable.select('*'))
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit);

    if (params.ownerId) {
      query.andWhere({
        [postsTable.predicate('ownerId')]: params.ownerId
      });
    }

    if (params.tagId) {
      query
        .innerJoin(
          postTagsTable.name,
          postTagsTable.predicate('postId'),
          postsTable.predicate('id')
        )
        .andWhere({
          [postTagsTable.predicate('tagId')]: params.tagId
        });
    }

    const rows = await query;

    return {
      items: pagination.getRows(rows).map<Post>(postsTable.toAlias),
      cursors: pagination.getCursors(rows)
    };
  };

  getRecentPostsByOwnerIds = async (params: GetRecentPostsByOwnerIdsParams): Promise<Post[]> => {
    const rows = await this.db.unionAll(params.ownerIds.map(
      (ownerId) => this.db
        .from(postsTable.name)
        .select(postsTable.select('*'))
        .where(postsTable.predicate('ownerId'), ownerId)
        .orderBy(postsTable.predicate('creationTimestamp'), 'desc')
        .limit(3)
    ), true);

    return rows.map<Post>(postsTable.toAlias);
  };

  attachTagsToPost = async (params: AttachTagsToPostParams, opts: TransactionOptions) => {
    return this.trx.query(opts,async (trx) => {
      const insert = params.tagIds.map(tagId => postTagsTable.insert({
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

  getRecentPostsOfTags = async (params: GetRecentPostsByTagsIdsParams): Promise<Record<string, Post[]>> => {
    const rows = await this.db.unionAll(params.tagIds.map(
      (tagId) => this.db
        .from(postsTable.name)
        .innerJoin(
          postTagsTable.name,
          postTagsTable.predicate('postId'),
          postsTable.predicate('id')
        )
        .select({
          ...postsTable.select('*'),
          ...postTagsTable.select('*'),
        })
        .where(postTagsTable.predicate('tagId'), tagId)
        .orderBy(postsTable.predicate('creationTimestamp'), 'desc')
        .limit(3)
    ), true);

    const postsOfTags: Record<string, Post[]> = {};

    for (const row of rows) {
      const post = postsTable.toAlias<Post>(row);
      const tagId = postTagsTable.toAlias<{ tagId: string }>(row).tagId;
      if (!postsOfTags[tagId]) {
        postsOfTags[tagId] = [];
      }
      postsOfTags[tagId].push(post)
    }

    return postsOfTags;
  };
}

export function makePostsCursorPagination(params: Partial<CursorPaginationParams<keyof Post>> = {}) {
  return makeCursorPagination({
    field: {
      alias: postsTable.prefixedAlias('creationTimestamp'),
      column: postsTable.column('creationTimestamp')
    },
    direction: params.direction || 'desc',
    limit: params.limit || 4,
    cursor: params.cursor,
  });
}
