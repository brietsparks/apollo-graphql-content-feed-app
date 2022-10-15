import {useMemo} from 'react'
import { ApolloClient } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'

import { API_URL } from '~/config';

import { apolloCache } from './apollo-cache';

export { apolloCache };

const cache = apolloCache;

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<any>;

function isSSR() {
  return typeof window === 'undefined';
}

function createApolloClient() {
  return new ApolloClient<any>({
    connectToDevTools: true,
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: API_URL,
      // credentials: 'same-origin',
    }),
    cache,
    // defaultOptions: {
    //   query: {
    //     errorPolicy: 'all',
    //     fetchPolicy: isSSR() ? 'no-cache' : 'cache-first'
    //   }
    // }
  })
}


export function initializeApollo(initialState: any = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray: any[], sourceArray: any[]) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    })

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }
  // For SSG and SSR always create a new Apollo Client
  if (isSSR()) return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function useApollo(pageProps: any) {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApollo(state), [state])
  return store
}

export function addApolloState(client: ApolloClient<any>, pageProps: any = {}) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps
}
