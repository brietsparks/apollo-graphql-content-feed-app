import { TypeOrm } from '../orm';

import { UsersRepository } from './users-repository';

export interface Repositories {
  usersRepository: UsersRepository
}

export function createRepositories(orm: TypeOrm): Repositories {
  const usersRepository = new UsersRepository(orm);

  return {
    usersRepository
  };
}
