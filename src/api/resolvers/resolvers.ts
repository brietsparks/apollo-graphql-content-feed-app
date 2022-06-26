import { Repositories } from '../../repositories';

import { makeUsersResolver } from './users-resolver';

export function makeResolvers(repositories: Repositories) {
  const usersResolver = makeUsersResolver(repositories);

  return {
    Query: {
      ...usersResolver.Query
    },
    Mutation: {
      ...usersResolver.Mutation
    },
    User: usersResolver.User
  }
}
