import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { statusesTable } from '../database';

import { TransactionsHelper, TransactionOptions } from './transactions';
import { CursorPaginationParams, CursorPaginationResult, makeCursorPagination } from './pagination';

export type Status = {
  id: string;
  projectId: string;
  name: string;
  creationTimestamp: Date;
}

export interface CreateStatusParams {
  projectId: string;
  name: string;
}

export interface GetStatusesByCursorParams {
  pagination: Partial<CursorPaginationParams<Status>>;
}

export interface GetStatusesOfProjectsParams {
  projectIds: string[];
}

export class StatusesRepository {
  private trx: TransactionsHelper;

  constructor(
    private db: Knex
  ) {
    this.trx = new TransactionsHelper(db);
  }

  createStatus = async (params: CreateStatusParams, opts: TransactionOptions) => {
    return this.trx.query(opts, (async (trx) => {
      const id = uuid();

      await trx
        .into(statusesTable.name)
        .insert(statusesTable.writeColumns({
          id,
          projectId: params.projectId,
          name: params.name
        }));

      return { id };
    }));
  };

  getStatus = async (id: string) => {
    return this.db
      .from(statusesTable.name)
      .select(statusesTable.columns)
      .where({ [statusesTable.columns.id]: id })
      .first();
  };

  getStatusesByCursor = async (params: GetStatusesByCursorParams): Promise<CursorPaginationResult<Status>> => {
    const pagination = makeStatusesCursorPagination(params.pagination);

    const statuses = await this.db
      .from(statusesTable.name)
      .select(statusesTable.columns)
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit);

    return pagination.getResult(statuses);
  };

  getStatusesOfProjects = async (params: GetStatusesOfProjectsParams): Promise<Status[]> => {
    return await this.db
      .from(statusesTable.name)
      .select(statusesTable.columns)
      .whereIn(statusesTable.columns.projectId, params.projectIds);
  };
}

export function makeStatusesCursorPagination(params: Partial<CursorPaginationParams<Status>>) {
  const defaultParams: CursorPaginationParams<Status> = {
    field: 'creationTimestamp',
    sortDirection: 'desc',
    limit: 10,
    fieldmap: statusesTable.columns,
  };

  return makeCursorPagination<Status>({
    ...defaultParams,
    ...params,
  });
}
