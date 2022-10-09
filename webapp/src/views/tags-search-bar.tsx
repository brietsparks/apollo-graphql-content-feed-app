import React from 'react';

import { SearchBar, SearchBarImplProps } from './search-bar';

export interface TagsSearchSuggestion {
  id: string;
  name?: string;
}

export type TagsSearchBarProps = SearchBarImplProps<TagsSearchSuggestion>;

export function TagsSearchBar(props: TagsSearchBarProps) {
  return (
    <SearchBar<TagsSearchSuggestion>
      {...props}
      getSuggestionLabel={i => i.name || i.id}
      getSuggestionKey={i => i.id}
      label="Tag"
      clearOnChange
    />
  );
}
