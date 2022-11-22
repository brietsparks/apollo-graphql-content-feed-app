import Dataloader from 'dataloader';

import { UsersRepository, User } from '../repositories';

export interface UsersLoader {
  getUsersByIds: Dataloader<string, User>;
}

export function makeUsersLoader(usersRepository: UsersRepository): UsersLoader {
  const getUsersByIds = async (ids: ReadonlyArray<string>) => {
    const usersByIds = await usersRepository.getUsersByIds({
      ids: ids as string[]
    });
    return ids.map(id => usersByIds[id]);
  };

  return {
    getUsersByIds: new Dataloader(getUsersByIds)
  };
}
