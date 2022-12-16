import { ApolloClient } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import { sha256 } from 'crypto-hash';

import { API_URL } from '~/config';

import { apolloCache } from './apollo-cache';

export { apolloCache };

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

export class IsomorphicApolloClient<TCacheShape> extends ApolloClient<TCacheShape> {
  hydrate = (state: any) => {
    const apolloState = state[APOLLO_STATE_PROP_NAME];
    const existingCache = this.extract()
    const data = merge(apolloState, existingCache, {
      arrayMerge: (destinationArray: any[], sourceArray: any[]) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    });

    this.cache.restore(data as TCacheShape)
  };

  injectState = (props: any) => {
    props[APOLLO_STATE_PROP_NAME] = this.cache.extract();
    return props;
  }
}

export function createApolloClient() {
  return new IsomorphicApolloClient<any>({
    connectToDevTools: true,
    ssrMode: typeof window === 'undefined',
    link:
      new HttpLink({ uri: API_URL }),
      // createPersistedQueryLink({
      //   sha256,
      //   useGETForHashedQueries: true
      // })
      // .concat(new HttpLink({ uri: API_URL })),
    cache: apolloCache,
  })
}
