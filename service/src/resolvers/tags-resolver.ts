import { IFieldResolver } from '@graphql-tools/utils';

import { Repositories, Tag } from '../repositories';
import * as schema from '../graphql';

import { adaptCursorPagination } from './adapters';
import { RequestContext } from './context';

export function makeTagsResolver(repositories: Repositories) {
  const createTag: IFieldResolver<unknown, RequestContext, schema.MutationCreateTagArgs> = async (_, { params }) => {
    const creation = await repositories.tagsRepository.createTag(params, { commit: true });
    return repositories.tagsRepository.getTag(creation.id);
  }

  const getTag: IFieldResolver<unknown, RequestContext, schema.QueryGetTagArgs> = (_, { id }) => {
    return repositories.tagsRepository.getTag(id);
  };

  const getTags: IFieldResolver<unknown, RequestContext, schema.QueryGetTagsArgs> = (_, { params }) => {
    return repositories.tagsRepository.getTags({
      pagination: adaptCursorPagination<Tag>(params.pagination)
    });
  };

  const searchTags: IFieldResolver<unknown, RequestContext, schema.QuerySearchTagsArgs> = (_, { params }) => {
    return repositories.tagsRepository.searchTags({
      term: params.term,
      pagination: adaptCursorPagination<Tag>(params.pagination)
    });
  };

  const getRecentPosts: IFieldResolver<Tag, RequestContext> = (tag, _, ctx) => {
    return ctx.loaders.postsLoader.getRecentPostsOfTags.load(tag.id);
  }

  const getRecentImages: IFieldResolver<Tag, RequestContext> = (tag, _, ctx) => {
    return ctx.loaders.imagesLoader.getRecentImagesOfTags.load(tag.id);
  }

  return {
    Query: {
      getTag,
      getTags,
      searchTags,
    },
    Mutation: {
      createTag
    },
    Tag: {
      id: (t) => t.id,
      creationTimestamp: (t) => t.creationTimestamp,
      name: (t) => t.name,
      recentPosts: getRecentPosts,
      recentImages: getRecentImages,
    }
  }
}
