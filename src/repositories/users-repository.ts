import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { usersTable } from '../database';

import { TransactionsHelper, TransactionOptions } from './transactions';
import { CursorPaginationParams, CursorPaginationResult, makeCursorPagination } from './pagination';

export interface ItemOffsetPaginationParams { // todo
  sortField: string;
  sortDirection: string;
  limit: number; // itemLimit
  offset: number; // itemOffset
}

export interface PageOffsetPaginationParams {
  sortField: string;
  sortDirection: string;
  limit: number;
  page: number;
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

export const defaultUserItemOffsetPaginationParams: ItemOffsetPaginationParams = {
  sortField: usersTable.columns.creationTimestamp,
  sortDirection: 'desc',
  limit: 10,
  offset: 0
};

export const defaultUserPageOffsetPaginationParams: PageOffsetPaginationParams = {
  sortField: usersTable.columns.creationTimestamp,
  sortDirection: 'desc',
  limit: 10,
  page: 1
};

export interface CreateUserParams {
  name: string;
}

export interface GetUsersByCursorParams {
  pagination: Partial<CursorPaginationParams>;
}

export interface GetUsersByItemOffsetParams {
  pagination: Partial<ItemOffsetPaginationParams>;
}

export interface GetUsersByPageOffsetParams {
  pagination: Partial<PageOffsetPaginationParams>;
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

  getUsersByItemOffset = async (params: GetUsersByItemOffsetParams) => {
    const pagination: ItemOffsetPaginationParams = {
      ...defaultUserItemOffsetPaginationParams,
      ...params.pagination,
      sortField: usersTable.columns[params.pagination.sortField] || defaultUserItemOffsetPaginationParams.sortField
    }

    const users = await this.db
      .from(usersTable.name)
      .select(usersTable.columns)
      .offset(pagination.offset)
      .limit(pagination.limit)
      .orderBy(pagination.sortField, pagination.sortDirection);

    return {
      items: users,
      page: pagination
    };
  }

  getUsersByPageOffset = async (params: GetUsersByPageOffsetParams) => {
    const pagination: PageOffsetPaginationParams = {
      ...defaultUserPageOffsetPaginationParams,
      ...params.pagination,
      sortField: usersTable.columns[params.pagination.sortField] || defaultUserPageOffsetPaginationParams.sortField
    };

    const currentPage = pagination.page > 0 ? pagination.page : 1;
    const pageOffset = currentPage - 1;
    const offset = pageOffset * pagination.limit;

    const users = await this.db
      .from(usersTable.name)
      .select(usersTable.columns)
      .offset(offset)
      .limit(pagination.limit)
      .orderBy(pagination.sortField, pagination.sortDirection);

    const usersCount = await this.db
      .from(usersTable.name)
      .count('*');

    const lastPage = Math.ceil(usersCount[0].count / pagination.limit);

    return {
      items: users,
      page: {
        current: currentPage,
        last: lastPage,
        totalItems: usersCount[0].count
      }
    };
  };
}
