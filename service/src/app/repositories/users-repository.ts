import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { usersTable } from '../database';

import { TransactionsHelper, TransactionOptions } from './transactions';
import { CursorPaginationParams, FieldParam, makeCursorPagination } from './lib/pagination';
import { CursorPaginationResult } from './shared';

export type User = {
  id: string;
  name: string;
  creationTimestamp: string;
}

export interface CreateUserParams {
  name: string;
}

export interface GetUsersByCursorParams {
  pagination: Partial<CursorPaginationParams<keyof User>>;
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
        .insert(usersTable.insert({
          id,
          name: params.name
        }));

      return { id };
    });
  };

  getUser = async (id: string): Promise<User> => {
    const row = await this.db
      .from(usersTable.name)
      .select(usersTable.select('*'))
      .where({ [usersTable.predicate('id')]: id })
      .first();

    if (!row) {
      return undefined;
    }

    return usersTable.toAlias<User>(row);
  };

  getUsers = async (params: GetUsersByCursorParams): Promise<CursorPaginationResult<User>> => {
    const pagination = makeUsersCursorPagination(params.pagination);

    const rows = await this.db
      .from(usersTable.name)
      .select(usersTable.select('*'))
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit);

    return {
      items: pagination.getRows(rows).map<User>(usersTable.toAlias),
      cursors: pagination.getCursors(rows)
    };
  }

  getUsersByIds = async (params: GetProjectsByIdsParams): Promise<Record<string, User>> => {
    const usersByIds: Record<string, User> = {};

    const rows = await this.db
      .from(usersTable.name)
      .select(usersTable.select('*'))
      .whereIn(usersTable.predicate('id'), params.ids);

    const users = rows.map<User>(usersTable.toAlias);

    for (const user of users) {
      usersByIds[user.id] = user;
    }

    return usersByIds;
  };
}

export function makeUsersCursorPagination(params: Partial<CursorPaginationParams<keyof User>>) {
  return makeCursorPagination({
    field: {
      alias: usersTable.prefixedAlias('creationTimestamp'),
      column: usersTable.column('creationTimestamp')
    },
    direction: params.direction || 'desc',
    limit: params.limit || 4,
    cursor: params.cursor,
  });
}
