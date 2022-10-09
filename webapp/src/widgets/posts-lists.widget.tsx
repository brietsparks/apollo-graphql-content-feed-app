import React from 'react';

import { useGetPostsQuery } from '~/apollo';

export interface PostsListWidgetProps {

}

export function PostsListWidget(props: PostsListWidgetProps) {
  const query = useGetPostsQuery({
    variables: {
      params: {
        pagination: {}
      }
    },
  });

  return (
    <pre>
      {JSON.stringify(query.data, null, 2)}
    </pre>
  );
}
