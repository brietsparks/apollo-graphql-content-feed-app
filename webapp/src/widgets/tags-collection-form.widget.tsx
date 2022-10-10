import React from 'react';

import { useSearchTagsLazyQuery } from '~/apollo';
import { TagsCollectionForm, TagsCollectionFormProps, TagsSearchSuggestion } from '~/views';

export interface TagsCollectionFormWidgetProps {
  value?: TagsCollectionFormProps['value'];
  onChange?: TagsCollectionFormProps['onChange'];
}

export function TagsCollectionFormWidget(props: TagsCollectionFormWidgetProps) {
  const [searchTags, query] = useSearchTagsLazyQuery();

  const handleInputChange = (term: string) => {
    if (term) {
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
  };

  const suggestions: TagsSearchSuggestion[] = query.data?.searchTags.items.map(tag => ({
    id: tag.id,
    name: tag.name || undefined
  })) || [];

  return (
    <TagsCollectionForm
      value={props.value}
      onChange={props.onChange}
      searchBarProps={{
        onInputChange: handleInputChange,
        loading: query.loading,
        suggestions: suggestions,
      }}
    />
  )
}
