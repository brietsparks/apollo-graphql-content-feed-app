import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { commentsTable, postCommentsTable } from '../database';

import { TransactionsHelper, TransactionOptions } from './transactions';
import { CursorPaginationParams, CursorPaginationResult, makeCursorPagination } from './lib/pagination';

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
        .insert(commentsTable.toColumnCase({
          id,
          ownerId: params.ownerId,
          body: params.body,
        }));

      const postCommentId = uuid();
      await trx
        .into(postCommentsTable.name)
        .insert(postCommentsTable.toColumnCase({
          id: postCommentId,
          postId: params.postId,
          commentId: id
        }));

      return { id, postCommentId };
    });
  };

  getComment = async (id: string) => {
    return this.db
      .from(commentsTable.name)
      .where({ [commentsTable.rawColumn('id')]: id })
      .select(commentsTable.rawColumns())
      .first();
  };

  getCommentsOfPost = async (params: GetCommentsOfPostParams) => {
    const pagination = makeCursorPagination({
      field: commentsTable.prefixedColumn(params.pagination.field || 'creationTimestamp'),
      sortDirection: params.pagination.sortDirection || 'desc',
      limit: params.pagination.limit || 12,
      cursor: params.pagination.cursor,
    })

    this.db
      .from(commentsTable.name)
      .innerJoin(
        postCommentsTable.name,
        postCommentsTable.prefixedColumn('commentId'),
        commentsTable.prefixedColumn('id')
      )
      .select(commentsTable.prefixedColumns())
      // todo
  };
}
