import { IFieldResolver } from '@graphql-tools/utils';

import { Repositories, Post } from '../repositories';
import * as schema from '../graphql';

import { adaptCursorPagination } from './adapters';
import { RequestContext } from './context';

export function makePostsResolver(repositories: Repositories) {
  const createPost: IFieldResolver<unknown, RequestContext, schema.MutationCreatePostArgs> = async (_, { params }) => {
    const creation = await repositories.postsRepository.createPost(params, { commit: true });
    return repositories.postsRepository.getPost(creation.id);
  }

  const getPost: IFieldResolver<unknown, RequestContext, schema.QueryGetPostArgs> = (_, { id }) => {
    return repositories.postsRepository.getPost(id);
  };

  const getPosts: IFieldResolver<unknown, RequestContext, schema.QueryGetPostsArgs> = (_, { params }) => {
    return repositories.postsRepository.getPosts({
      pagination: adaptCursorPagination<Post>(params.pagination),
      ownerId: params.ownerId,
      tagId: params.tagId,
    });
  };

  const getPostOwner: IFieldResolver<Post, RequestContext> = (post, _, ctx) => {
    return ctx.loaders.usersLoader.getUsersByIds.load(post.ownerId);
  };

  const getPostTags: IFieldResolver<Post, RequestContext> = (post, _, ctx) => {
    return ctx.loaders.tagsLoader.getTagsOfPosts.load(post.id);
  };

  return {
    Query: {
      getPost,
      getPosts,
    },
    Mutation: {
      createPost
    },
    Post: {
      id: (p) => p.id,
      creationTimestamp: (p) => p.creationTimestamp,
      ownerId: (p) => p.ownerId,
      owner: getPostOwner,
      tags: getPostTags,
      title: (p) => p.title,
      body: (p) => p.body
    }
  }
}
