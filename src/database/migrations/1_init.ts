import { createSqlFileMigration } from '../util';

const { up, down } = createSqlFileMigration({
  upFile: `${__dirname}/../sql/1_init.up.sql`,
  downFile: `${__dirname}/../sql/1_init.down.sql`
})

export { up, down };
