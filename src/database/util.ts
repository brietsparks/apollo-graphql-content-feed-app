import { Knex } from 'knex';
import { readFileSync } from 'fs';

export interface TableResult<T extends Record<string, string>> {
  name: string;
  columns: T;
  prefixedColumns: Record<keyof T, string>;
}

export function table<T extends Record<string, string>>(name: string, columns: T): TableResult<T> {
  const prefixedColumns: Record<string, string> = {};
  for (const [appColumnName, dbColumnName] of Object.entries(columns)) {
    prefixedColumns[appColumnName] = `${name}.${dbColumnName}`;
  }

  return {
    name,
    columns,
    prefixedColumns: prefixedColumns as Record<keyof T, string>
  };
}

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
