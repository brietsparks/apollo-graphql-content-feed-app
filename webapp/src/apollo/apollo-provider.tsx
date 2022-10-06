import React, { ReactNode, useRef } from 'react';
import { ApolloClient, ApolloProvider as BaseApolloProvider, createHttpLink } from "@apollo/client";

import { apolloCache } from './apollo-cache';

export interface ApolloProviderProps {
  url: string
  children: ReactNode;
}

export function ApolloProvider({ url, children }: ApolloProviderProps) {
  const client = useRef(getApolloClient(url)).current;
  return (
    <BaseApolloProvider client={client}>
      {children}
    </BaseApolloProvider>
  );
}

export function getApolloClient(url: string) {
  const httpLink = createHttpLink({
    uri: url,
  });

  return new ApolloClient({
    cache: apolloCache,
    link: httpLink,
  });
}
