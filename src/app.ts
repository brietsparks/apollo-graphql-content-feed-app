import { makeKnexClient } from './database';
import { makeRepositories } from './repositories';
import { makeServer } from './api';

export type App = ReturnType<typeof createApp>;

export interface AppParams {
  db: {
    user: string;
    password: string;
    host: string;
    database: string;
    port: number;
  };
}


/*
user: 'appuser',
password: 'apppassword',
host: '127.0.0.1',
database: 'example_app',
port: 5432
*/

export function createApp(params: AppParams) {
  const db = makeKnexClient({
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
