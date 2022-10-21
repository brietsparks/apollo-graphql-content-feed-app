import React from 'react';

import { useGetContentItemsQuery } from '~/apollo';

import { GetContentItemsQueryItem } from './apollo';
import { DataDump, PaginatedList } from '~/views';

export interface ContentItemsListWidgetProps {

}

const limit = 4;

export function ContentItemsListWidget(props: ContentItemsListWidgetProps) {
  const query = useGetContentItemsQuery({
    variables: {
      params: {
        pagination: {
          limit
        }
      }
    }
  });

  const loadMore = () => {
    void query.fetchMore({
      variables: {
        params: {
          pagination: {
            cursor: query.data?.getContentItems.cursors.next,
            limit
          }
        }
      }
    });
  };

  return (
    <PaginatedList<GetContentItemsQueryItem>
      itemsData={query.data?.getContentItems.items}
      getItemKey={data => data.id}
      mapItemDataToProps={data => data}
      itemComponent={DataDump}
      loadMore={loadMore}
      hasMore={!!query.data?.getContentItems.cursors.next}
      isLoadingMore={query.loading}
    />
  )
}
