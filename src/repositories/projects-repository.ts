import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { projectsTable } from '../database';

import { TransactionsHelper, TransactionOptions } from './transactions';
import { CursorPaginationParams, CursorPaginationResult, makeCursorPagination } from './pagination';

export type Project = {
  id: string;
  name: string;
  creationTimestamp: Date;
}

export interface CreateProjectParams {
  name: string;
}

export interface GetProjectsByCursorParams {
  pagination: CursorPaginationParams;
}

export class ProjectsRepository {
  static defaultPaginationField = projectsTable.columns.creationTimestamp

  private trx: TransactionsHelper;

  constructor(
    private db: Knex
  ) {
    this.trx = new TransactionsHelper(db);
  }

  createProject = async (params: CreateProjectParams, opts: TransactionOptions) => {
    return this.trx.query(opts, (async (trx) => {
      const id = uuid();

      await trx
        .into(projectsTable.name)
        .insert({
          [projectsTable.columns.id]: id,
          [projectsTable.columns.name]: params.name,
        });

      return { id };
    }));
  };

  getProjectsByCursor = async (params: GetProjectsByCursorParams): Promise<CursorPaginationResult<Project>> => {
    const pagination = makeProjectsCursorPagination(params.pagination);

    const projects = await this.db
      .from(projectsTable.name)
      .select(projectsTable.columns)
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit);

    return pagination.getResult(projects);
  };
}

export function makeProjectsCursorPagination(params: Partial<CursorPaginationParams>) {
  const defaultParams: CursorPaginationParams = {
    field: projectsTable.columns.creationTimestamp,
    sortDirection: 'desc',
    limit: 10,
    fieldmap: projectsTable.columns,
  };

  return makeCursorPagination<Project>({
    ...defaultParams,
    ...params,
  });
}
