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

export interface GetPaginatedProjectsParams {
  cursorPagination: CursorPaginationParams;
}

export class ProjectsRepository {
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

  getPaginatedProjects = async (params: GetPaginatedProjectsParams): Promise<CursorPaginationResult<Project>> => {
    const paginationColumn = projectsTable.columns[params.cursorPagination.field] || projectsTable.columns.creationTimestamp;
    const pagination = makeCursorPagination<Project>({
      fieldmap: projectsTable.columns,
      ...params.cursorPagination,
      field: paginationColumn,
    });

    const projects = await this.db
      .from(projectsTable.name)
      .select(projectsTable.columns)
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit);
    
    return pagination.getResult(projects);
  };
}
