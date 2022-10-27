import { Knex } from 'knex';

import { commentsTable } from '../database';

export class CommentsRepository {
  constructor(
    private db: Knex
  ) {}

  createPostComment = async () => {

  };
}
