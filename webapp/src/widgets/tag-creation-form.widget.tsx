import React from 'react';

import { useCreateTagMutation } from '~/apollo';
import { TagForm, TagFormData } from '~/views';

import { createTagMutationUpdate } from './apollo';

export interface TagCreationFormWidgetProps {
}

export function TagCreationFormWidget(props: TagCreationFormWidgetProps) {
  const [createTag, tagCreation] = useCreateTagMutation({
    update: createTagMutationUpdate,
  });

  const submitForm = (data: TagFormData) => {
    void createTag({
      variables: {
        params: {
          name: data.name,
        }
      }
    });
  };

  return (
    <TagForm
      submit={submitForm}
      buttonLabel="Create Tag"
    />
  );
}
