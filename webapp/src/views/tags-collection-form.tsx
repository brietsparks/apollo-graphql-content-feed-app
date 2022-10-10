import React, { useState, useEffect, useCallback } from 'react';
import { Stack, Chip } from '@mui/material';

import { TagsSearchBar, TagsSearchSuggestion, TagsSearchBarProps } from './tags-search-bar';

export type { TagsSearchBarProps };

export interface TagsCollectionFormProps {
  searchBarProps: TagsSearchBarProps;
  value?: TagsCollectionItem[];
  onChange?: (data: TagsCollectionItem[]) => void;
}

export type TagsCollectionItem = TagsSearchSuggestion;

export function TagsCollectionForm(props: TagsCollectionFormProps) {
  const { onChange } = props;

  const [value, setValue] = useState<TagsCollectionItem[]>(props.value || []);
  useEffect(() => {
    if (props.value) {
      setValue(props.value);
    }
  }, [props.value]);

  const handleChange = useCallback((item?: TagsSearchSuggestion) => {
    if (item) {
      setValue(prev => {
        const newItems = [...prev, item];
        onChange?.(newItems);
        return newItems;
      });
    }
  }, [onChange]);

  const unselectItem = (id: string) => {
    setValue(prev => {
      const newItems = prev.filter(item => item.id !== id);
      onChange?.(newItems);
      return newItems;
    });
  };

  // fixme: performance
  const suggestions = props.searchBarProps.suggestions.filter(
    suggestion => !value.map(item => item.id).includes(suggestion.id)
  );

  return (
    <Stack spacing={2}>
      <TagsSearchBar
        {...props.searchBarProps}
        suggestions={suggestions}
        onChange={handleChange}
      />

      <div>
        {value.map(tag => (
          <Chip
            key={tag.id}
            id={tag.id}
            label={tag.name}
            onDelete={() => unselectItem(tag.id)}
          />
        ))}
      </div>
    </Stack>
  )
}
