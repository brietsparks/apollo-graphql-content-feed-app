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

  const getPosts: IFieldResolver<unknown, RequestContext, schema.QueryGetPostsArgs> = (_, { pagination }) => {
    return repositories.postsRepository.getPostsByCursor({
      pagination: adaptCursorPagination<Post>(pagination)
    });
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
      title: (p) => p.title,
      body: (p) => p.body
    }
  }
}
