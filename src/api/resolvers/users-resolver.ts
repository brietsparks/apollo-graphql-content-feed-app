import { IFieldResolver } from '@graphql-tools/utils';

import { Repositories } from '../../repositories';
import * as schema from '../../graphql';

import { RequestContext } from './context';

export function makeUsersResolver(repositories: Repositories) {
  const createUser: IFieldResolver<unknown, RequestContext, schema.MutationCreateUserArgs> = (_, { params }) => {
    return repositories.usersRepository.createUser(params);
  }

  const getUser: IFieldResolver<unknown, RequestContext, schema.QueryUserArgs> = (_, { id }) => {
    return repositories.usersRepository.getUser(id);
  };

  const getUserFields = {
    id: (u) => u.id,
    name: (u) => u.name
  };

  return {
    Query: {
      user: getUser
    },
    Mutation: {
      createUser
    },
    User: getUserFields
  }
}
