import { Repositories } from '../repositories';

import { makeUsersResolver } from './users-resolver';
import { makePostsResolver } from './posts-resolver';
import { makeImagesResolver } from './images-resolver';
import { makeContentItemsResolver } from './content-items-resolver';

export function makeResolvers(repositories: Repositories) {
  const usersResolver = makeUsersResolver(repositories);
  const postsResolver = makePostsResolver(repositories);
  const imagesReolver = makeImagesResolver(repositories);
  const contentItemsResolver = makeContentItemsResolver(repositories);

  return {
    Query: {
      ...usersResolver.Query,
      ...postsResolver.Query,
      ...imagesReolver.Query,
      ...contentItemsResolver.Query,
    },
    Mutation: {
      ...usersResolver.Mutation,
      ...postsResolver.Mutation,
      ...imagesReolver.Mutation,
    },
    User: usersResolver.User,
    Post: postsResolver.Post,
    Image: imagesReolver.Image,
    ContentItem: contentItemsResolver.ContentItem,
  }
}
