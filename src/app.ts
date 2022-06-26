import { makeKnexClient } from './database';
import { makeRepositories } from './repositories';
import { makeServer } from './api';

export function createApp() {
  const db = makeKnexClient({
    connection: {
      user: 'appuser',
      password: 'apppassword',
      host: '127.0.0.1',
      database: 'example_app',
      port: 5432
    }
  });

  const repositories = makeRepositories(db);

  const server = makeServer(repositories);

  return {
    db,
    repositories,
    server
  };
}
