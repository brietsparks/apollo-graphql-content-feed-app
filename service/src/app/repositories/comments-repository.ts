import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { TransactionsHelper, TransactionOptions, CursorPaginationParams, makeCursorPagination } from '~/lib/knex';

import { commentsTable, postCommentsTable } from '../database';

import { CursorPaginationResult } from './shared';

export type Comment = {
  id: string;
  creationTimestamp: string;
  ownerId: string;
  body: string;
}

export interface CreatePostCommentParams {
  ownerId: string;
  postId: string;
  body: string;
}

export interface GetCommentsOfPostParams {
  postId: string;
  pagination?: Partial<CursorPaginationParams<keyof Comment>>;
}

export class CommentsRepository {
  private trx: TransactionsHelper;

  constructor(
    private db: Knex
  ) {
    this.trx = new TransactionsHelper(db);
  }

  createPostComment = async (params: CreatePostCommentParams, opts: TransactionOptions) => {
    return this.trx.query(opts, async (trx) => {
      const id = uuid();

      await trx
        .into(commentsTable.name)
        .insert(commentsTable.insert({
          id,
          ownerId: params.ownerId,
          body: params.body,
        }));

      const postCommentId = uuid();
      await trx
        .into(postCommentsTable.name)
        .insert(postCommentsTable.insert({
          id: postCommentId,
          postId: params.postId,
          commentId: id
        }));

      return { id, postCommentId };
    });
  };

  getComment = async (id: string) => {
    const row = await this.db
      .from(commentsTable.name)
      .where({ [commentsTable.predicate('id')]: id })
      .select(commentsTable.select('*'))
      .first();

    if (!row) {
      return undefined;
    }

    return commentsTable.toAlias<Comment>(row);
  };

  getCommentsOfPost = async (params: GetCommentsOfPostParams): Promise<CursorPaginationResult<Comment>> => {
    const pagination = makeCursorPagination({
      field: {
        alias: commentsTable.prefixedAlias('creationTimestamp'),
        column: commentsTable.column('creationTimestamp')
      },
      direction: params.pagination?.direction || 'desc',
      limit: params.pagination?.limit || 12,
      cursor: params.pagination?.cursor,
    })

    const rows = await this.db
      .from(commentsTable.name)
      .innerJoin(
        postCommentsTable.name,
        postCommentsTable.predicate('commentId'),
        commentsTable.predicate('id')
      )
      .where({
        [postCommentsTable.predicate('postId')]: params.postId
      })
      .andWhere(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit)
      .select(commentsTable.select('*'))

    return {
      items: pagination.getRows(rows).map<Comment>(commentsTable.toAlias),
      cursors: pagination.getCursors(rows)
    };
  };
}
