import React from 'react';

import { useCreateImageMutation } from '~/apollo';
import { ImageForm, ImageFormData, ImageFormProps } from '~/views';

import { createImageMutationUpdate } from './apollo';
import { useCurrentUser } from './current-user-context.widget';
import { TagsCollectionFormWidget } from './tags-collection-form.widget';

export interface ImageCreationFormWidgetProps {
}

export function ImageCreationFormWidget(props: ImageCreationFormWidgetProps) {
  const currentUserId = useCurrentUser();
  const [createImage, imageCreation] = useCreateImageMutation({
    update: createImageMutationUpdate,
  });

  const submitForm = async (data: ImageFormData) => {
    if (!currentUserId) {
      return;
    }

    return await createImage({
      variables: {
        params: {
          ownerId: currentUserId,
          ...data
        }
      },
    });
  };

  return (
    <ImageForm
      submit={submitForm}
      buttonLabel="Create Image"
      pending={imageCreation.loading}
      tagsComponent={TagsCollectionFormWidget as ImageFormProps['tagsComponent']}
    />
  );
}
