import { MutationUpdaterFunction as BaseMutationUpdaterFunction, DefaultContext, ApolloCache } from '@apollo/client';

import { apolloCache, generated } from '~/apollo';

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
            cursors: existing.cursors,
            items: [newPost, ...existing.items],
          };
        }
      }
    }
  });
};

export const createImageMutationUpdate: MutationUpdaterFunction<generated.CreateImageMutation, generated.CreateImageMutationVariables> = (cache, { data }) => {
  cache.modify({
    fields: {
      getImages(existing: generated.GetImagesQuery['getImages'], { toReference }) {
        if (data) {
          const newImage = toReference({
            __typename: data.createImage.__typename,
            id: data.createImage.id
          });

          return {
            cursors: existing.cursors,
            items: [newImage, ...existing.items],
          };
        }
      }
    }
  });
};
