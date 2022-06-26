import pg from 'pg';
import { knex, Knex } from 'knex';

pg.types.setTypeParser(20, 'text', parseInt)

export function makeKnexClient(cfg: Knex.Config) {
  return knex({
    client: 'pg',
    migrations: {
      directory: `${__dirname}/migrations`
    },
    ...cfg
  });
}
