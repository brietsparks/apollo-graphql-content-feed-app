import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { usersTable } from '../database';

import { TransactionsHelper, TransactionOptions } from './transactions';
import { CursorPaginationParams, CursorPaginationResult, makeCursorPagination } from './pagination';

export type User = {
  id: string;
  name: string;
  creationTimestamp: string;
}

export const defaultUserPaginationParams: CursorPaginationParams = {
  field: usersTable.columns.creationTimestamp,
  sortDirection: 'desc',
  limit: 10,
  fieldmap: usersTable.columns,
}

export interface CreateUserParams {
  name: string;
}

export interface GetUsersParams {
  cursorPagination: CursorPaginationParams;
}

export class UsersRepository {
  private trx: TransactionsHelper;

  constructor(
    private db: Knex
  ) {
    this.trx = new TransactionsHelper(db);
  }

  createUser = async (params: CreateUserParams, opts: TransactionOptions) => {
    return this.trx.query(opts, async (trx) => {
      const id = uuid();

      await trx
        .into(usersTable.name)
        .insert({
          [usersTable.columns.id]: id,
          [usersTable.columns.name]: params.name
        });

      return { id };
    });
  };

  getUser = async (id: string) => {
    return this.db
      .from(usersTable.name)
      .select(usersTable.columns)
      .where({ [usersTable.columns.id]: id })
      .first();
  };

  getUsers = async (params: GetUsersParams): Promise<CursorPaginationResult<User>> => {
    const pagination = makeCursorPagination<User>({
      ...defaultUserPaginationParams,
      ...params.cursorPagination,
    });

    const users = await this.db
      .from(usersTable.name)
      .select(usersTable.columns)
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit);

    return pagination.getResult(users);
  }
}
