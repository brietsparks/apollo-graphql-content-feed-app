import { InMemoryCache, FieldPolicy } from '@apollo/client';

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
        ...incoming,
        items: [...(existing?.items || []), ...(incoming?.items || [])],
      };
    }
  };
}
