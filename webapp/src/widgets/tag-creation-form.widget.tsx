import React from 'react';

import { useCreateTagMutation } from '~/apollo';
import { TagForm, TagFormData } from '~/views';

export interface TagCreationFormWidgetProps {
}

export function TagCreationFormWidget(props: TagCreationFormWidgetProps) {
  const [createTag, tagCreation] = useCreateTagMutation();

  const submitForm = (data: TagFormData) => {
    void createTag({
      variables: {
        params: {
          name: data.name
        }
      },
    });
  };

  return (
    <TagForm
      submit={submitForm}
      buttonLabel="Create Tag"
    />
  );
}
