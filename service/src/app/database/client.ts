import { knex, Knex } from 'knex';

export async function makeKnexClient(cfg: Knex.Config) {
  const client = knex({
    client: 'pg',
    migrations: {
      directory: `${__dirname}/migrations`
    },
    ...cfg
  });

  await client.raw(`SELECT NOW() as now;`);

  return client;
}
