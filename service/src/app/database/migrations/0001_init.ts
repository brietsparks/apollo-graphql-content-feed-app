import { createSqlFileMigration } from '~/lib/knex';

const { up, down } = createSqlFileMigration({
  upFile: `${__dirname}/../sql/0001_init.up.sql`,
  downFile: `${__dirname}/../sql/0001_init.down.sql`
})

export { up, down };
