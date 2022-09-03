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

export interface CreateUserParams {
  name: string;
}

export interface GetUsersByCursorParams {
  pagination: Partial<CursorPaginationParams<User>>;
}

export interface GetProjectsByIdsParams {
  ids: string[]
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
        .insert(usersTable.writeColumns({
          id,
          name: params.name
        }));

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
    const pagination = makeUsersCursorPagination(params.pagination);

    const users = await this.db
      .from(usersTable.name)
      .select(usersTable.columns)
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit);

    return pagination.getResult(users);
  }

  getUsersByIds = async (params: GetProjectsByIdsParams): Promise<User[]> => {
    return this.db
      .from(usersTable.name)
      .select(usersTable.columns)
      .whereIn(usersTable.columns.id, params.ids);
  };
}

export function makeUsersCursorPagination(params: Partial<CursorPaginationParams<User>>) {
  const defaultParams: CursorPaginationParams<User> = {
    field: 'creationTimestamp',
    sortDirection: 'desc',
    limit: 10,
    fieldmap: usersTable.columns,
  };

  return makeCursorPagination<User>({
    ...defaultParams,
    ...params,
  });
}
