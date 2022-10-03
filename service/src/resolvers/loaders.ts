import { Repositories } from '../repositories';

import { makeUsersLoader } from './users-loader';
import { makeTagsLoader } from './tags-loader';
import { makePostsLoader } from './posts-loader';
import { makeImagesLoader } from './images-loader';

export type Loaders = ReturnType<typeof makeLoaders>;

export function makeLoaders(repositories: Repositories) {
  const usersLoader = makeUsersLoader(repositories.usersRepository);
  const tagsLoader = makeTagsLoader(repositories.tagsRepository);
  const postsLoader = makePostsLoader(repositories.postsRepository);
  const imagesLoader = makeImagesLoader(repositories.imagesRepository);

  return {
    usersLoader,
    tagsLoader,
    postsLoader,
    imagesLoader,
  };
}
