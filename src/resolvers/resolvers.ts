import { Repositories } from '../repositories';

import { makeUsersResolver } from './users-resolver';
import { makePostsResolver } from './posts-resolver';

export function makeResolvers(repositories: Repositories) {
  const usersResolver = makeUsersResolver(repositories);
  const postsResolver = makePostsResolver(repositories);

  return {
    Query: {
      ...usersResolver.Query,
      ...postsResolver.Query,
    },
    Mutation: {
      ...usersResolver.Mutation,
      ...postsResolver.Mutation,
    },
    User: usersResolver.User,
    Post: postsResolver.Post,
  }
}
