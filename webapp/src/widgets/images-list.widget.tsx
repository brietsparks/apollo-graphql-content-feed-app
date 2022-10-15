import React from 'react';

import { useGetImagesQuery } from '~/apollo';
import { PaginatedList, DataDump } from '~/views';

import { GetImagesQueryItem } from './apollo';

export interface ImagesListWidgetProps {
}

const limit = 4;

export function ImagesListWidget(props: ImagesListWidgetProps) {
  const query = useGetImagesQuery({
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
            cursor: query.data?.getImages.cursors.next,
            limit
          }
        }
      }
    });
  };

  return (
    <PaginatedList<GetImagesQueryItem>
      itemsData={query.data?.getImages.items}
      getItemKey={data => data.id}
      mapItemDataToProps={data => data}
      itemComponent={DataDump}
      loadMore={loadMore}
      hasMore={!!query.data?.getImages.cursors.next}
      isLoadingMore={query.loading}
    />
  );
}
