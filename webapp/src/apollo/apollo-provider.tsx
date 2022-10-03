import React, { ReactNode, useRef } from 'react';
import { ApolloClient, ApolloProvider as BaseApolloProvider, createHttpLink } from "@apollo/client";

import { apolloCache } from './apollo-cache';

export interface ApolloProviderProps {
  url: string
  children: ReactNode;
}

export function ApolloProvider({ url, children }: ApolloProviderProps) {
  const httpLink = createHttpLink({
    uri: url,
  });

  const apolloClient = useRef(new ApolloClient({
    cache: apolloCache,
    link: httpLink
  })).current;

  return (
    <BaseApolloProvider client={apolloClient}>
      {children}
    </BaseApolloProvider>
  )
}
