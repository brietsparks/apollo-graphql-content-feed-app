import { IFieldResolver } from '@graphql-tools/utils';

import { Repositories, User } from '../repositories';
import * as schema from '../graphql';

import { adaptCursorPagination } from './adapters';
import { RequestContext } from './context';

export function makeUsersResolver(repositories: Repositories) {
  const createUser: IFieldResolver<unknown, RequestContext, schema.MutationCreateUserArgs> = async (_, { params }) => {
    const creation = await repositories.usersRepository.createUser(params, { commit: true });
    return repositories.usersRepository.getUser(creation.id);
 }

  const getUser: IFieldResolver<unknown, RequestContext, schema.QueryGetUserArgs> = (_, { id }) => {
    return repositories.usersRepository.getUser(id);
  };

  const getUsersByCursor: IFieldResolver<unknown, RequestContext, schema.QueryGetUsersArgs> = (_, { pagination }) => {
    return repositories.usersRepository.getUsersByCursor({
      pagination: adaptCursorPagination<User>(pagination)
    });
  };

  const getUsers = getUsersByCursor;

  return {
    Query: {
      getUser,
      getUsers,
    },
    Mutation: {
      createUser
    },
    User: {
      id: (u) => u.id,
      name: (u) => u.name,
      creationTimestamp: (u) => u.creationTimestamp
    }
  }
}
