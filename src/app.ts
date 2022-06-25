import { createOrm } from './orm';
import { createRepositories } from './repositories';

export function createApp() {
  const orm = createOrm({
    host: '127.0.0.1',
    port: 5432,
    username: 'appuser',
    password: 'apppassword',
    database: 'example_app',
    synchronize: true,
    logging: false,
  });

  const repositories = createRepositories(orm);

  return {
    orm,
    repositories
  }
}
