import React from 'react';

import { useCreatePostMutation, createPostMutationUpdate, GetPostsDocument } from '~/apollo';
import { PostForm, PostFormData, PostFormProps } from '~/views';

import { useCurrentUser } from './current-user-context.widget';
import { TagsCollectionFormWidget } from './tags-collection-form.widget';

export interface PostCreationFormWidgetProps {
}

export function PostCreationFormWidget(props: PostCreationFormWidgetProps) {
  const currentUserId = useCurrentUser();
  const [createPost, postCreation] = useCreatePostMutation({
    update: createPostMutationUpdate,
  });

  const submitForm = async (data: PostFormData) => {
    if (!currentUserId) {
      return;
    }

    return await createPost({
      variables: {
        params: {
          ownerId: currentUserId,
          ...data
        }
      },
    });
  };

  return (
    <PostForm
      submit={submitForm}
      buttonLabel="Create Post"
      pending={postCreation.loading}
      tagsFormComponent={TagsCollectionFormWidget as PostFormProps['tagsFormComponent']}
    />
  );
}
