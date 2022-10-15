import React from 'react';

import { useGetTagsQuery } from '~/apollo';
import { PaginatedList, DataDump } from '~/views';

import { GetTagsQueryItem } from './apollo';

export interface TagsListWidgetProps {
}

const limit = 4;

export function TagsListWidget(props: TagsListWidgetProps) {
  const query = useGetTagsQuery({
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
            cursor: query.data?.getTags.cursors.next,
            limit
          }
        }
      }
    });
  };

  return (
    <PaginatedList<GetTagsQueryItem>
      itemsData={query.data?.getTags.items}
      getItemKey={data => data.id}
      mapItemDataToProps={data => data}
      itemComponent={DataDump}
      loadMore={loadMore}
      hasMore={!!query.data?.getTags.cursors.next}
      isLoadingMore={query.loading}
    />
  );
}
