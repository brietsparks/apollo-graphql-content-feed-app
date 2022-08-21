import { knex, Knex } from 'knex';

export function makeKnexClient(cfg: Knex.Config) {
  return knex({
    client: 'pg',
    migrations: {
      directory: `${__dirname}/migrations`
    },
    ...cfg
  });
}
