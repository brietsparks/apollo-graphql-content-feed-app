import { Repositories } from '../../repositories';

import { makeUsersResolver } from './users-resolver';
import { makeProjectsResolver } from './projects-resolver';

export function makeResolvers(repositories: Repositories) {
  const usersResolver = makeUsersResolver(repositories);
  const projectsResolver = makeProjectsResolver(repositories);

  return {
    Query: {
      ...usersResolver.Query,
      ...projectsResolver.Query,
    },
    Mutation: {
      ...usersResolver.Mutation,
      ...projectsResolver.Mutation,
    },
    User: usersResolver.User,
    Project: projectsResolver.Project
  }
}
