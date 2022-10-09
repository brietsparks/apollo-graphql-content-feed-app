import React, { useState, useMemo } from 'react';
import { Stack, Chip } from '@mui/material';

import { TagsSearchBar, TagsSearchSuggestion, TagsSearchBarProps } from './tags-search-bar';

export type { TagsSearchBarProps };

export interface TagsCollectionFormProps {
  searchBarProps: TagsSearchBarProps;
  items?: TagsCollectionItem[];
  onChange?: (data: TagsCollectionItem[]) => void;
}

export type TagsCollectionItem = TagsSearchSuggestion;

export function TagsCollectionForm(props: TagsCollectionFormProps) {
  const [items, setItems] = useState<TagsCollectionItem[]>(props.items || []);
  useMemo(() => {
    if (props.items) {
      setItems(props.items);
    }
  }, [props.items]);

  const handleChange = (item?: TagsSearchSuggestion) => {
    if (item) {
      setItems(prev => {
        const newItems = [...prev, item];
        props.onChange?.(newItems);
        return newItems;
      });
    }
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <Stack spacing={2}>
      <TagsSearchBar {...props.searchBarProps} onChange={handleChange} />

      <div>
        {items.map(item => (
          <Chip
            key={item.id}
            id={item.id}
            label={item.name}
            onDelete={() => removeItem(item.id)}
          />
        ))}
      </div>
    </Stack>
  )
}
