import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { projectsTable } from '../database';

import { TransactionsHelper, TransactionOptions } from './transactions';
import { CursorPaginationParams, makePagination } from './pagination';

export interface CreateProjectParams {
  name: string;
}

export interface GetPaginatedProjectsParams {
  pagination: CursorPaginationParams;
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

  getPaginatedProjects = async (params: GetPaginatedProjectsParams) => {
    const q = this.db
      .from(projectsTable.name)
      .select(projectsTable.columns);
  };
}
