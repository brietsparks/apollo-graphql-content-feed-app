import { Repositories } from '../repositories';

import { makeUsersResolver } from './users-resolver';
import { makeTagsResolver } from './tags-resolver';
import { makePostsResolver } from './posts-resolver';
import { makeImagesResolver } from './images-resolver';
import { makeContentItemsResolver } from './content-items-resolver';

export function makeResolvers(repositories: Repositories) {
  const usersResolver = makeUsersResolver(repositories);
  const tagsResolver = makeTagsResolver(repositories);
  const postsResolver = makePostsResolver(repositories);
  const imagesReolver = makeImagesResolver(repositories);
  const contentItemsResolver = makeContentItemsResolver(repositories);

  return {
    Query: {
      ...usersResolver.Query,
      ...tagsResolver.Query,
      ...postsResolver.Query,
      ...imagesReolver.Query,
      ...contentItemsResolver.Query,
    },
    Mutation: {
      ...usersResolver.Mutation,
      ...tagsResolver.Mutation,
      ...postsResolver.Mutation,
      ...imagesReolver.Mutation,
    },
    User: usersResolver.User,
    Tag: tagsResolver.Tag,
    Post: postsResolver.Post,
    Image: imagesReolver.Image,
    ContentItem: contentItemsResolver.ContentItem,
  }
}
