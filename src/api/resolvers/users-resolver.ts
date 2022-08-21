import { IFieldResolver } from '@graphql-tools/utils';

import { Repositories, CursorPaginationParams } from '../../repositories';
import * as schema from '../../graphql';

import { RequestContext } from './context';

export function makeUsersResolver(repositories: Repositories) {
  const createUser: IFieldResolver<unknown, RequestContext, schema.MutationCreateUserArgs> = async (_, { params }) => {
    const creation = await repositories.usersRepository.createUser(params, { commit: true });
    return repositories.usersRepository.getUser(creation.id);
 }

  const getUser: IFieldResolver<unknown, RequestContext, schema.QueryGetUserArgs> = (_, { id }) => {
    return repositories.usersRepository.getUser(id);
  };

  const getUsers: IFieldResolver<unknown, RequestContext, schema.QueryGetUsersArgs> = (_, { pagination }) => {
    return repositories.usersRepository.getUsers({
      cursorPagination: pagination as CursorPaginationParams
    });
  };

  const getUserFields = {
    id: (u) => u.id,
    name: (u) => u.name
  };

  return {
    Query: {
      getUser,
      getUsers
    },
    Mutation: {
      createUser
    },
    User: getUserFields
  }
}
