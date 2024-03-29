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

export const createTagMutationUpdate: MutationUpdaterFunction<generated.CreateTagMutation, generated.CreateTagMutationVariables> = (cache, { data }) => {
  cache.modify({
    fields: {
      getTags(existing: generated.GetTagsQuery['getTags'], { toReference }) {
        if (data) {
          const newTag = toReference({
            __typename: data.createTag.__typename,
            id: data.createTag.id
          });

          return {
            cursors: existing.cursors,
            items: [newTag, ...existing.items],
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
      },
      getContentItems(existing: generated.GetContentItemsQuery['getContentItems'], { toReference }) {
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

  data?.createPost.tags.forEach(tag => {
    cache.modify({
      id: cache.identify({
        __typename: tag.__typename,
        id: tag.id
      }),
      fields: {
        recentPosts(existing: generated.Tag['recentPosts'], { toReference }) {
          const newPost = toReference({
            __typename: data.createPost.__typename,
            id: data.createPost.id
          });
          return [newPost, ...existing];
        }
      }
    })
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
      },
      getContentItems(existing: generated.GetContentItemsQuery['getContentItems'], { toReference }) {
        if (data) {
          const newPost = toReference({
            __typename: data.createImage.__typename,
            id: data.createImage.id
          });

          return {
            cursors: existing.cursors,
            items: [newPost, ...existing.items],
          };
        }
      }
    }
  });

  data?.createImage.tags.forEach(tag => {
    cache.modify({
      id: cache.identify({
        __typename: tag.__typename,
        id: tag.id
      }),
      fields: {
        recentImages(existing: generated.Tag['recentImages'], { toReference }) {
          const newPost = toReference({
            __typename: data.createImage.__typename,
            id: data.createImage.id
          });
          return [newPost, ...existing];
        }
      }
    })
  });
};
