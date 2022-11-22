import { makeKnexClient } from '~/app/database';
import { makeRepositories } from '~/app/repositories';
import { makeServer } from '~/app/server';

export type App = Awaited<ReturnType<typeof createApp>>;

export interface AppParams {
  db: {
    user: string;
    password: string;
    host: string;
    database: string;
    port: number;
  };
  apqCacheUrl?: string;
}

export async function createApp(params: AppParams) {
  const db = await makeKnexClient({
    connection: params.db
  });

  const repositories = makeRepositories(db);

  const server = makeServer(repositories, {
    apqCacheUrl: params.apqCacheUrl
  });

  return {
    db,
    repositories,
    server
  };
}
