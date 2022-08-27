import { IFieldResolver } from '@graphql-tools/utils';

import { Repositories } from '../../repositories';
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

  const getUsersByCursor: IFieldResolver<unknown, RequestContext, schema.QueryGetUsersByCursorArgs> = (_, { pagination }) => {
    return repositories.usersRepository.getUsersByCursor({ pagination });
  };

  const getUsersByOffset: IFieldResolver<unknown, RequestContext, schema.QueryGetUsersByOffsetArgs> = (_, { pagination }) => {
    return repositories.usersRepository.getUsersByItemOffset({ pagination });
  };

  const getUsersByPageOffset: IFieldResolver<unknown, RequestContext, schema.QueryGetUsersByPageOffsetArgs> = (_, { pagination }) => {
    return repositories.usersRepository.getUsersByPageOffset({ pagination });
  }

  const getUsers = getUsersByCursor;

  const getUserFields = {
    id: (u) => u.id,
    name: (u) => u.name
  };

  return {
    Query: {
      getUser,
      getUsers,
      getUsersByCursor,
      getUsersByOffset,
      getUsersByPageOffset,
    },
    Mutation: {
      createUser
    },
    User: getUserFields
  }
}
