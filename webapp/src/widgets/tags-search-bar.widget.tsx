import React from 'react';

import { useSearchTagsLazyQuery } from '~/apollo';
import { TagsSearchBar, TagsSearchBarProps, TagsSearchSuggestion } from '~/views';

export interface TagsSearchBarWidgetProps {
  onChange?: TagsSearchBarProps['onChange'];
}

export function TagsSearchBarWidget(props: TagsSearchBarWidgetProps) {
  const [searchTags, query] = useSearchTagsLazyQuery();

  const handleInputChange = (term: string) => {
    void searchTags({
      variables: {
        params: {
          term,
          pagination: {
            limit: 3
          }
        }
      },
      fetchPolicy: 'no-cache'
    });
  }

  const suggestions: TagsSearchSuggestion[] = query.data?.searchTags.items.map(tag => ({
    id: tag.id,
    name: tag.name || undefined
  })) || [];

  return (
    <TagsSearchBar
      onInputChange={handleInputChange}
      onChange={props.onChange}
      loading={query.loading}
      suggestions={suggestions}
    />
  )
}
