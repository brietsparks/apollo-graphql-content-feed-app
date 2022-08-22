import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { usersTable } from '../database';

import { TransactionsHelper, TransactionOptions } from './transactions';
import { CursorPaginationParams, CursorPaginationResult, makeCursorPagination } from './pagination';

export interface OffsetPaginationParams { // todo
  sortField: string;
  sortDirection: string;
  limit: number;
  offset: number;
}


export type User = {
  id: string;
  name: string;
  creationTimestamp: string;
}

export const defaultUserCursorPaginationParams: CursorPaginationParams = {
  field: usersTable.columns.creationTimestamp,
  sortDirection: 'desc',
  limit: 10,
  fieldmap: usersTable.columns,
};

export const defaultUserOffsetPaginationParams: OffsetPaginationParams = {
  sortField: usersTable.columns.creationTimestamp,
  sortDirection: 'desc',
  limit: 10,
  offset: 0
};

export interface CreateUserParams {
  name: string;
}

export interface GetUsersByCursorParams {
  pagination: Partial<CursorPaginationParams>;
}

export interface GetUsersByOffsetParams {
  pagination: Partial<OffsetPaginationParams>
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

  getUsersByCursor = async (params: GetUsersByCursorParams): Promise<CursorPaginationResult<User>> => {
    const pagination = makeCursorPagination<User>({
      ...defaultUserCursorPaginationParams,
      ...params.pagination,
    });

    const users = await this.db
      .from(usersTable.name)
      .select(usersTable.columns)
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit);

    return pagination.getResult(users);
  }

  getUsersByOffset = async (params: GetUsersByOffsetParams) => {
    const pagination: OffsetPaginationParams = {
      ...defaultUserOffsetPaginationParams,
      ...params.pagination,
      sortField: usersTable.columns[params.pagination.sortField] || defaultUserOffsetPaginationParams.sortField
    }

    const users = await this.db
      .from(usersTable.name)
      .select(usersTable.columns)
      .offset(pagination.offset)
      .limit(pagination.limit)
      .orderBy(pagination.sortField, pagination.sortDirection);

    console.log({users  })

    return {
      items: users,
      page: pagination
    };
  }
}
