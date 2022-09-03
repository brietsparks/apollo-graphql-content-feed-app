import { Repositories } from '../repositories';

import { makeUsersLoader } from './users-loader';
import { makePostsLoader } from './posts-loader';

export type Loaders = ReturnType<typeof makeLoaders>;

export function makeLoaders(repositories: Repositories) {
  const usersLoader = makeUsersLoader(repositories.usersRepository);
  const postsLoader = makePostsLoader(repositories.postsRepository);

  return {
    usersLoader,
    postsLoader,
  };
}
