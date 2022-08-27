import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { readFileSync } from 'fs';

import { Repositories } from '../repositories';
import { makeResolvers } from '../resolvers';

const typeDefs = readFileSync(require.resolve('../graphql/schema.graphql')).toString('utf-8');

export function makeServer(repositories: Repositories) {
  const expressServer = express();

  const resolvers = makeResolvers(repositories);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    formatError: (error) => {
      console.log(JSON.stringify(error, null, 2));
      return error;
    }
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
