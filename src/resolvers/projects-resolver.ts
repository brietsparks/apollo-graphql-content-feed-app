import { IFieldResolver } from '@graphql-tools/utils';

import { Repositories, Project } from '../repositories';
import * as schema from '../graphql';

import { adaptCursorPagination } from './adapters';
import { RequestContext } from './context';

export function makeProjectsResolver(repositories: Repositories) {
  const createProject: IFieldResolver<unknown, RequestContext, schema.MutationCreateProjectArgs> = async (_, { params }) => {
    const creation = await repositories.projectsRepository.createProject(params, { commit: true });
    return repositories.projectsRepository.getProject(creation.id);
  }

  const getProject: IFieldResolver<unknown, RequestContext, schema.QueryGetProjectArgs> = (_, { id }) => {
    return repositories.projectsRepository.getProject(id);
  };

  const getProjectsByCursor: IFieldResolver<unknown, RequestContext, schema.QueryGetProjectsByCursorArgs> = (_, { pagination }) => {
    return repositories.projectsRepository.getProjectsByCursor({
      pagination: adaptCursorPagination<Project>(pagination)
    });
  };

  const getProjects = getProjectsByCursor;

  return {
    Query: {
      getProject,
      getProjects,
      getProjectsByCursor,
    },
    Mutation: {
      createProject,
    },
    Project: {
      id: (p) => p.id,
      name: (p) => p.name,
      creationTimestamp: (p) => p.creationTimestamp
    }
  };
}
