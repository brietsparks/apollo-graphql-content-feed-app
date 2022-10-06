import React from 'react';

import { useGetUsersQuery } from '~/apollo';

export interface UsersListWidgetProps {

}

export function UsersListWidget(props: UsersListWidgetProps) {
  const query = useGetUsersQuery({
    variables: {
      params: {}
    },
  });

  return (
    <pre>
      {JSON.stringify(query.data, null, 2)}
    </pre>
  );
}
