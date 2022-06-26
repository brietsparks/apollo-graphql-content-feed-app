import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { usersTable } from '../database';

export interface CreateUserParams {
  name: string;
}

export class UsersRepository {
  constructor(
    private db: Knex
  ) {}

  createUser = async (params: CreateUserParams) => {
    const id = uuid();
    await this.db
      .into(usersTable.name)
      .insert({
        [usersTable.columns.id]: id,
        [usersTable.columns.name]: params.name
      });

    return this.getUser(id);
  }

  getUser = async (id: string) => {
    return this.db
      .from(usersTable.name)
      .select(usersTable.columns)
      .where({ [usersTable.columns.id]: id })
      .first();
  }
}
