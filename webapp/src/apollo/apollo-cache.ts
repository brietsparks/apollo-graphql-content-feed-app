import { InMemoryCache, FieldPolicy } from '@apollo/client';
import uniqBy from 'lodash/uniqBy';
import reverse from 'lodash/reverse';

export const apolloCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getPosts: cursorPaginatedField()
      },
    },
  }
});

function cursorPaginatedField(): FieldPolicy {
  return {
    keyArgs: false,
    merge(existing, incoming) {
      return {
        items: mergeUnique([...(existing?.items || []), ...(incoming?.items || [])], '__ref'),
        cursors: incoming.cursors
      };
    }
  };
}

function mergeUnique(array: Record<string, unknown>[], key: string) {
  // https://stackoverflow.com/questions/64171841/lodash-uniqby-update-the-latest-value
  return reverse(uniqBy(reverse(array), key))
}
