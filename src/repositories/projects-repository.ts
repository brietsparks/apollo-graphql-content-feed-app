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
  pagination: Partial<CursorPaginationParams<Project>>;
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
        .insert(projectsTable.writeColumns({
          id,
          name: params.name
        }));

      return { id };
    }));
  };

  getProject = async (id: string) => {
    return this.db
      .from(projectsTable.name)
      .select(projectsTable.columns)
      .where({ [projectsTable.columns.id]: id })
      .first();
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

export function makeProjectsCursorPagination(params: Partial<CursorPaginationParams<Project>>) {
  const defaultParams: CursorPaginationParams<Project> = {
    field: 'creationTimestamp',
    sortDirection: 'desc',
    limit: 10,
    fieldmap: projectsTable.columns,
  };

  return makeCursorPagination<Project>({
    ...defaultParams,
    ...params,
  });
}
