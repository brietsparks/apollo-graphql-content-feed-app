import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { issuesTable } from '../database';

import { TransactionsHelper, TransactionOptions } from './transactions';
import { CursorPaginationParams, CursorPaginationResult, makeCursorPagination } from './pagination';

export type Issue = {
  id: string;
  creationTimestamp: Date;
  assigneeId: string | null;
  statusId: string | null;
  name: string;
  description: string | null;
}

export interface CreateIssueParams {
  name: string;
  assigneeId?: string;
  statusId?: string;
  description?: string;
}

export interface GetIssuesByCursorParams {
  pagination: Partial<CursorPaginationParams<Issue>>;
}

export class IssuesRepository {
  private trx: TransactionsHelper;

  constructor(
    private db: Knex
  ) {
    this.trx = new TransactionsHelper(db);
  }

  createIssue = async (params: CreateIssueParams, opts: TransactionOptions) => {
    return this.trx.query(opts, (async (trx) => {
      const id = uuid();

      await trx
        .into(issuesTable.name)
        .insert(issuesTable.writeColumns({
          id,
          assigneeId: params.assigneeId,
          statusId: params.statusId,
          name: params.name,
          description: params.description,
        }));

      return { id };
    }));
  };

  getIssue = async (id: string) => {
    return this.db
      .from(issuesTable.name)
      .select(issuesTable.columns)
      .where({ [issuesTable.columns.id]: id })
      .first();
  };

  getIssuesByCursor = async (params: GetIssuesByCursorParams): Promise<CursorPaginationResult<Issue>> => {
    const pagination = makeIssuesCursorPagination(params.pagination);

    const issues = await this.db
      .from(issuesTable.name)
      .select(issuesTable.columns)
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit);

    return pagination.getResult(issues);
  };
}

export function makeIssuesCursorPagination(params: Partial<CursorPaginationParams<Issue>>) {
  const defaultParams: CursorPaginationParams<Issue> = {
    field: 'creationTimestamp',
    sortDirection: 'desc',
    limit: 10,
    fieldmap: issuesTable.columns,
  };

  return makeCursorPagination<Issue>({
    ...defaultParams,
    ...params,
  });
}
