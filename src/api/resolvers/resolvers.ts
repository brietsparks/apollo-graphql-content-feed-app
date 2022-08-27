import { Repositories } from '../../repositories';

import { makeUsersResolver } from './users-resolver';
import { makeProjectsResolver } from './projects-resolver';
import { makeIssuesResolver } from './issues-resolver';

export function makeResolvers(repositories: Repositories) {
  const usersResolver = makeUsersResolver(repositories);
  const projectsResolver = makeProjectsResolver(repositories);
  const issuesResolver = makeIssuesResolver(repositories);

  return {
    Query: {
      ...usersResolver.Query,
      ...projectsResolver.Query,
      ...issuesResolver.Query,
    },
    Mutation: {
      ...usersResolver.Mutation,
      ...projectsResolver.Mutation,
      ...issuesResolver.Mutation
    },
    User: usersResolver.User,
    Project: projectsResolver.Project,
    Issue: issuesResolver.Issue
  }
}
