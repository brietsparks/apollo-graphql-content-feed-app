import { MutationUpdaterFunction as BaseMutationUpdaterFunction, DefaultContext, ApolloCache } from '@apollo/client';

import * as generated from './generated';
import { apolloCache } from './apollo-cache';

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type GetUsersQueryItem = ArrayElement<generated.GetUsersQuery['getUsers']['items']>;

type MutationUpdaterFunction<TData, TVariables> = BaseMutationUpdaterFunction<TData, TVariables, DefaultContext, ApolloCache<typeof apolloCache>>;

export const createUserMutationUpdate: MutationUpdaterFunction<generated.CreateUserMutation, generated.CreateUserMutationVariables> = (cache, { data }) => {
  cache.modify({
    fields: {
      getUsers(existing: generated.GetUsersQuery['getUsers'], { toReference }) {
        if (data) {
          const newUser = toReference({
            __typename: data.createUser.__typename,
            id: data.createUser.id
          });

          return {
            items: [newUser, ...existing.items],
            cursors: existing.cursors
          };
        }
      }
    }
  });
};

export const createPostMutationUpdate: MutationUpdaterFunction<generated.CreatePostMutation, generated.CreatePostMutationVariables> = (cache, { data }) => {
  cache.modify({
    fields: {
      getPosts(existing: generated.GetPostsQuery['getPosts'], { toReference }) {
        if (data) {
          const newPost = toReference({
            __typename: data.createPost.__typename,
            id: data.createPost.id
          });

          return {
            items: [newPost, ...existing.items],
            cursors: existing.cursors
          };
        }
      }
    }
  });
};
