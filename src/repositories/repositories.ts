import { Knex } from 'knex';

import { UsersRepository } from './users-repository';

export type Repositories = ReturnType<typeof makeRepositories>;

export function makeRepositories(db: Knex) {
  const usersRepository = new UsersRepository(db);

  return {
    usersRepository
  }
}
