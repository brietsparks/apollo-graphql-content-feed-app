import { makeKnexClient } from './database';
import { makeRepositories } from './repositories';
import { makeServer } from './server';

export type App = Awaited<ReturnType<typeof createApp>>;

export interface AppParams {
  db: {
    user: string;
    password: string;
    host: string;
    database: string;
    port: number;
  };
}

export async function createApp(params: AppParams) {
  const db = await makeKnexClient({
    connection: params.db
  });

  const repositories = makeRepositories(db);

  const server = makeServer(repositories);

  return {
    db,
    repositories,
    server
  };
}
