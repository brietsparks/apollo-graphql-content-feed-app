import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import {  } from '../database';

import { TransactionsHelper, TransactionOptions } from './transactions';

export interface CreateProjectParams {
  name: string;
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
    }));
  }
}
