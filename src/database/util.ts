import { Knex } from 'knex';
import { readFileSync } from 'fs';

export interface CreateMigrationParams {
  upFile: string;
  downFile: string;
}

export function createSqlFileMigration(params: CreateMigrationParams) {
  function up(knex: Knex) {
    const sql = readFileSync(params.upFile).toString();
    return knex.schema.raw(sql);
  }

  function down(knex: Knex) {
    const sql = readFileSync(params.downFile).toString();
    return knex.schema.raw(sql);
  }

  return { up, down };
}
