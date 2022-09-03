import Dataloader from 'dataloader';

import { UsersRepository, User } from '../repositories';

export interface UsersLoader {
  getUsersByIds: Dataloader<string, User>;
}

export function makeUsersLoader(usersRepository: UsersRepository): UsersLoader {
  const getUsersByIds = async (ids: ReadonlyArray<string>) => {
    const users = await usersRepository.getUsersByIds({
      ids: ids as string[]
    });

    const lookup: Record<string, User> = {};
    for (const user of users) {
      lookup[user.id] = user;
    }

    return ids.map(id => lookup[id]);
  };

  return {
    getUsersByIds: new Dataloader(getUsersByIds)
  };
}
