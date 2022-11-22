import { IFieldResolver } from '@graphql-tools/utils';

import { Repositories, Post } from '../repositories';
import * as schema from '../graphql';

import { adaptCursorPagination } from './adapters';
import { RequestContext } from './context';

export function makeCommentsResolver(repositories: Repositories) {
  const createPostComment: IFieldResolver<unknown, RequestContext, schema.MutationCreatePostCommentArgs> = async (_, { params }) => {
    const { id } = await repositories.commentsRepository.createPostComment({
      postId: params.postId,
      ownerId: params.ownerId,
      body: params.body,
    }, { commit: true });
    return await repositories.commentsRepository.getComment(id);
  };

  const getComment: IFieldResolver<unknown, RequestContext, schema.QueryGetCommentArgs> = async (_, { id }) => {
    return repositories.commentsRepository.getComment(id);
  };

  return {
    Query: {
      getComment
    },
    Mutation: {
      createPostComment
    },
    Comment: {
      id: (c) => c.id,
      creationTimestamp: (c) => c.creationTimestamp,
      ownerId: (c) => c.ownerId,
      body: (c) => c.body
    }
  }
}
