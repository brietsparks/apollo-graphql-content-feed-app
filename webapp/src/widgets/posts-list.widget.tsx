import React from 'react';

import { useGetPostsQuery } from '~/apollo';
import { PaginatedList, DataDump } from '~/views';

export interface PostsListWidgetProps {
}

const limit = 3;

export function PostsListWidget(props: PostsListWidgetProps) {
  const query = useGetPostsQuery({
    variables: {
      params: {
        pagination: { limit }
      }
    },
  });

  const loadMore = () => {
    void query.fetchMore({
      variables: {
        params: {
          pagination: {
            cursor: query.data?.getPosts.cursors.next,
            limit
          }
        }
      }
    });
  };

  return (
    <PaginatedList
      itemsData={query.data?.getPosts.items}
      getItemKey={data => data.id}
      mapItemDataToProps={data => data}
      itemComponent={DataDump}
      loadMore={loadMore}
      hasMore={!!query.data?.getPosts.cursors.next}
      isLoadingMore={query.loading}
    />
  );
}
