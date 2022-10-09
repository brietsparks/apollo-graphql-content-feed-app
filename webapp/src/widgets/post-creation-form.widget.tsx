import React from 'react';

import { useCreatePostMutation } from '~/apollo';
import { PostForm, PostFormData } from '~/views';

import { useCurrentUser } from './current-user-context.widget';
import { TagsCollectionFormWidget } from './tags-collection-form.widget';

export interface PostCreationFormWidgetProps {
}

export function PostCreationFormWidget(props: PostCreationFormWidgetProps) {
  const currentUserId = useCurrentUser();
  const [createPost, postCreation] = useCreatePostMutation();

  const submitForm = (data: PostFormData) => {
    if (!currentUserId) {
      return;
    }

    return createPost({
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
      tagsFormComponent={TagsCollectionFormWidget}
    />
  );
}
