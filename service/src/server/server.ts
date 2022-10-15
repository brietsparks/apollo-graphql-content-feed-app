import { readFileSync } from 'fs';
import express from 'express';
import { KeyValueCache } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import Keyv from "keyv";
import { KeyvAdapter } from "@apollo/utils.keyvadapter";

import { Repositories } from '../repositories';
import { makeResolvers, makeLoaders } from '../resolvers';

const typeDefs = readFileSync(require.resolve('../graphql/schema.graphql')).toString('utf-8');

export interface MakeServerOptions {
  apqCacheUrl?: string;
}

export function makeServer(repositories: Repositories, opts: MakeServerOptions = {}) {
  const expressServer = express();

  const resolvers = makeResolvers(repositories);

  let cache: KeyValueCache|undefined;
  if (opts.apqCacheUrl) {
    cache = new KeyvAdapter(new Keyv(opts.apqCacheUrl));
  }

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    formatError: (error) => {
      console.log(JSON.stringify(error, null, 2));
      return error;
    },
    context: () => {
      return {
        loaders: makeLoaders(repositories)
      };
    },
    cache,
  });

  const start = async () => {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app: expressServer });
    return expressServer;
  }

  return {
    start,
    apolloServer,
    expressServer
  };
}
