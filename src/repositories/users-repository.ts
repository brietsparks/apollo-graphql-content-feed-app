import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { usersTable } from '../database';

import { TransactionsHelper, TransactionOptions } from './transactions';

export interface CreateUserParams {
  name: string;
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
}
