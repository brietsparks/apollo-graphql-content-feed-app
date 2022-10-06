import React from 'react';

import { useCreateUserMutation, createUserMutationUpdate } from '~/apollo';
import { UserForm, UserFormData } from '~/views';

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
