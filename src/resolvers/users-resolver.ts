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

  const getUsers: IFieldResolver<unknown, RequestContext, schema.QueryGetUsersArgs> = (_, { pagination }) => {
    return repositories.usersRepository.getUsersByCursor({
      pagination: adaptCursorPagination<User>(pagination)
    });
  };

  const getRecentPostsOfUser: IFieldResolver<User, RequestContext> = async (user, _, ctx) => {
    return ctx.loaders.postsLoader.getPostsByOwnerIds.load(user.id);
  };

  const getRecentImagesOfUser: IFieldResolver<User, RequestContext> = async (user, _, ctx) => {
    return ctx.loaders.imagesLoader.getImagesByOwnerIds.load(user.id);
  };

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
      creationTimestamp: (u) => u.creationTimestamp,
      recentPosts: getRecentPostsOfUser,
      recentImages: getRecentImagesOfUser,
      name: (u) => u.name,
    }
  }
}
