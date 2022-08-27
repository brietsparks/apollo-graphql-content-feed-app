import { Knex } from 'knex';
import { readFileSync } from 'fs';

export interface Table<T extends Record<string, string>> {
  name: string;
  columns: T;
  prefixedColumns: Record<keyof T, string>;
  writeColumns: (values: Partial<Record<keyof T, unknown>>) => Record<T[keyof T], unknown>;
}

export function table<T extends Record<string, string>>(name: string, columns: T): Table<T> {
  const prefixedColumns: Record<string, string> = {};
  for (const [appColumnName, dbColumnName] of Object.entries(columns)) {
    prefixedColumns[appColumnName] = `${name}.${dbColumnName}`;
  }

  // todo: function writeColumns<EntityType>
  function writeColumns(values: Partial<Record<keyof T, unknown>>): Record<T[keyof T], unknown> {
    return Object.entries(values).reduce((acc, [field, value]) => {
      acc[columns[field]] = value;
      return acc;
    }, {} as Record<T[keyof T], unknown>);
  }

  return {
    name,
    columns,
    prefixedColumns: prefixedColumns as Record<keyof T, string>,
    writeColumns
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
