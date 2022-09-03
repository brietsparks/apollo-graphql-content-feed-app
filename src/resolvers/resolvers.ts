import { Repositories } from '../repositories';

import { makeUsersResolver } from './users-resolver';
import { makePostsResolver } from './posts-resolver';
import { makeImagesResolver } from './images-resolver';

export function makeResolvers(repositories: Repositories) {
  const usersResolver = makeUsersResolver(repositories);
  const postsResolver = makePostsResolver(repositories);
  const imagesReolver = makeImagesResolver(repositories);

  return {
    Query: {
      ...usersResolver.Query,
      ...postsResolver.Query,
      ...imagesReolver.Query,
    },
    Mutation: {
      ...usersResolver.Mutation,
      ...postsResolver.Mutation,
      ...imagesReolver.Mutation,
    },
    User: usersResolver.User,
    Post: postsResolver.Post,
    Image: imagesReolver.Image,
  }
}
