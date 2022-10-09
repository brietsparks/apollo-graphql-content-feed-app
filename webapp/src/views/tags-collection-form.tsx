import React, { useState, useMemo, useCallback } from 'react';
import { Stack, Chip } from '@mui/material';

import { TagsSearchBar, TagsSearchSuggestion, TagsSearchBarProps } from './tags-search-bar';

export type { TagsSearchBarProps };

export interface TagsCollectionFormProps {
  searchBarProps: TagsSearchBarProps;
  selectedItems?: TagsCollectionItem[];
  onChange?: (data: TagsCollectionItem[]) => void;
}

export type TagsCollectionItem = TagsSearchSuggestion;

export function TagsCollectionForm(props: TagsCollectionFormProps) {
  const { onChange } = props;

  const [selectedItems, setSelectedItems] = useState<TagsCollectionItem[]>(props.selectedItems || []);
  useMemo(() => {
    if (props.selectedItems) {
      setSelectedItems(props.selectedItems);
    }
  }, [props.selectedItems]);

  const handleChange = useCallback((item?: TagsSearchSuggestion) => {
    if (item) {
      setSelectedItems(prev => {
        const newItems = [...prev, item];
        onChange?.(newItems);
        return newItems;
      });
    }
  }, [onChange]);

  const unselectItem = (id: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  // fixme: performance
  const suggestions = props.searchBarProps.suggestions.filter(
    suggestion => !selectedItems.map(item => item.id).includes(suggestion.id)
  );

  return (
    <Stack spacing={2}>
      <TagsSearchBar
        {...props.searchBarProps}
        suggestions={suggestions}
        onChange={handleChange}
      />

      <div>
        {selectedItems.map(item => (
          <Chip
            key={item.id}
            id={item.id}
            label={item.name}
            onDelete={() => unselectItem(item.id)}
          />
        ))}
      </div>
    </Stack>
  )
}
