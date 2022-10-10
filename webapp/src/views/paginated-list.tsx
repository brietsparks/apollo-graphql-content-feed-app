import React, { ComponentType } from 'react';

import { Button, CircularProgress } from '@mui/material';

export interface PaginatedListProps<ItemDataType, ItemPropsType> {
  itemsData?: ItemDataType[];
  itemComponent: ComponentType<ItemPropsType>;
  mapItemDataToProps: (data: ItemDataType) => ItemPropsType;
  getItemKey: (data: ItemDataType) => string;
  loadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export function PaginatedList<ItemDataType, ItemPropsType = ItemDataType>(props: PaginatedListProps<ItemDataType, ItemPropsType>) {
  const { mapItemDataToProps, getItemKey, itemComponent: ItemComponent } = props;

  return (
    <div>
      {props.itemsData?.map(itemData => {
        const key = getItemKey(itemData);
        const itemProps = mapItemDataToProps(itemData);
        return <ItemComponent key={key} {...itemProps} />;
      })}

      <Button
        disabled={!props.hasMore || props.isLoadingMore}
        endIcon={props.isLoadingMore && <CircularProgress />}
        onClick={props.loadMore}
      >Load More</Button>
    </div>
  )
}
