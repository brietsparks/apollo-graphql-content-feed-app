import { IFieldResolver } from '@graphql-tools/utils';

import { Repositories, Status } from '../repositories';
import * as schema from '../graphql';

import { adaptCursorPagination } from './adapters';
import { RequestContext } from './context';

export function makeStatusesResolver(repositories: Repositories) {
  const createStatus: IFieldResolver<unknown, RequestContext, schema.MutationCreateStatusArgs> = async (_, { params }) => {
    const creation = await repositories.statusesRepository.createStatus(params, { commit: true });
    return repositories.statusesRepository.getStatus(creation.id);
  }

  const getStatus: IFieldResolver<unknown, RequestContext, schema.QueryGetStatusArgs> = (_, { id }) => {
    return repositories.statusesRepository.getStatus(id);
  };

  const getStatusesByCursor: IFieldResolver<unknown, RequestContext, schema.QueryGetStatusesByCursorArgs> = (_, { pagination }) => {
    return repositories.statusesRepository.getStatusesByCursor({
      pagination: adaptCursorPagination<Status>(pagination)
    });
  };

  const getStatuses = getStatusesByCursor;

  return {
    Query: {
      getStatus,
      getStatuses,
      getStatusesByCursor,
    },
    Mutation: {
      createStatus,
    },
    Status: {
      id: (p) => p.id,
      name: (p) => p.name,
      creationTimestamp: (p) => p.creationTimestamp
    }
  };
}
