import React from 'react';

import { useCreateUserMutation } from '~/apollo';
import { UserForm, UserFormData } from '~/views';

import { createUserMutationUpdate } from './apollo';

export interface UserCreationFormWidgetProps {
}

export function UserCreationFormWidget(props: UserCreationFormWidgetProps) {
  const [createUser, userCreation] = useCreateUserMutation();

  const submitForm = (data: UserFormData) => {
    void createUser({
      variables: {
        params: {
          name: data.name
        }
      },
      update: createUserMutationUpdate
    });
  };

  return (
    <UserForm
      submit={submitForm}
      buttonLabel="Create User"
    />
  );
}
