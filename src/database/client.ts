import pg from 'pg';
import { knex, Knex } from 'knex';

pg.types.setTypeParser(20, 'text', parseInt)
pg.types.setTypeParser(1082, pgToString); // date
pg.types.setTypeParser(1083, pgToString); // time
pg.types.setTypeParser(1114, pgToString); // timestamp
pg.types.setTypeParser(1184, pgToString); // timestamptz
pg.types.setTypeParser(1266, pgToString); // timetz

function pgToString(value) {
  return value.toString();
}

export function makeKnexClient(cfg: Knex.Config) {
  return knex({
    client: 'pg',
    migrations: {
      directory: `${__dirname}/migrations`
    },
    ...cfg
  });
}
