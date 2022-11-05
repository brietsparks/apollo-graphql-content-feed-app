import React from 'react';

import { useCreatePostMutation } from '~/apollo';
import { PostForm, PostFormData, PostFormProps, PostFormSuccessHandler, PostFormDialog } from '~/views';

import { createPostMutationUpdate } from './apollo';
import { useCurrentUser } from './current-user-context.widget';
import { TagsCollectionFormWidget } from './tags-collection-form.widget';

export interface PostCreationFormWidgetProps {
  onSuccess?: PostFormSuccessHandler;
}

export function PostCreationFormWidget(props: PostCreationFormWidgetProps) {
  const { postCreation, submitForm } = usePostCreationFormModel();

  return (
    <PostForm
      submit={submitForm}
      submitButtonLabel="Create Post"
      pending={postCreation.loading}
      tagsComponent={TagsCollectionFormWidget as PostFormProps['tagsComponent']}
      onSuccess={props.onSuccess}
    />
  );
}

export type PostCreationFormDialogWidgetProps =
  PostCreationFormWidgetProps & {
  isOpen: boolean;
  close: () => void;
}

export function PostCreationFormDialogWidget(props: PostCreationFormDialogWidgetProps) {
  const { postCreation, submitForm } = usePostCreationFormModel();

  return (
    <PostFormDialog
      isOpen={props.isOpen}
      close={props.close}
      submit={submitForm}
      submitButtonLabel="Create Post"
      pending={postCreation.loading}
      tagsComponent={TagsCollectionFormWidget as PostFormProps['tagsComponent']}
      onSuccess={(e) => {
        props.close();
        props.onSuccess?.(e);
      }}
    />
  );
}

function usePostCreationFormModel() {
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

  return {
    submitForm,
    postCreation
  };
}
