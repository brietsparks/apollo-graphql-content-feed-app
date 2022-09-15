import { Knex } from 'knex';
import { readFileSync } from 'fs';

import invert from 'lodash/invert';

export interface Table<AliasToColumnType extends Record<string, string>> {
  name: string;
  columns: AliasToColumnType;
  writeColumns: (values: Partial<Record<keyof AliasToColumnType, unknown>>) => ColumnToValue<AliasToColumnType>;
  prefixedColumns: {
    all: PrefixedColumns;
    get(alias: keyof AliasToColumnType): string;
    unmarshal(prefixedValues: PrefixColumnToValue): Partial<AliasToValue<AliasToColumnType>>
  };
  // prefix: (aliasToColumn?: Partial<AliasToColumnType>) => PrefixedAliasToColumn;
  // unmarshal: (rows: Record<string, unknown>) => PrefixColumnToValue;
}

export type AliasToValue<AliasToColumnType> = Partial<Record<keyof AliasToColumnType, unknown>>;

export type ColumnToValue<AliasToColumnType extends Record<string, string>> = Record<ValueOf<AliasToColumnType>, unknown>;

export type PrefixColumnToValue = Record<string, unknown>;

export type PrefixedColumns = Record<string, string>;

export type ColumnToAlias<AliasToColumnType extends Record<string, string>> =
  Record<ValueOf<AliasToColumnType>, keyof AliasToColumnType>;

type ValueOf<T> = T[keyof T];

export interface PrefixOptions {
  alias?: boolean;
  column?: boolean;
}

export function table<AliasToColumnType extends Record<string, string>>(tableName: string, aliasToColumn: AliasToColumnType): Table<AliasToColumnType> {
  const columnToAliasMapping = invert(aliasToColumn);

  function writeColumns(values: AliasToValue<AliasToColumnType>): ColumnToValue<AliasToColumnType> { // todo: function writeColumns<EntityType>
    return Object.entries(values).reduce((acc, [field, value]) => {
      acc[aliasToColumn[field]] = value;
      return acc;
    }, {} as Record<AliasToColumnType[keyof AliasToColumnType], unknown>);
  }

  const allPrefixedColumns: PrefixedColumns = {};
  for (const column of Object.values(aliasToColumn)) {
    allPrefixedColumns[`${tableName}.${column}`] = `${tableName}.${column}`;
  }

  const unmarshal = (row: PrefixColumnToValue): Partial<AliasToValue<AliasToColumnType>> => {
    const unmarshalledRow = {};

    for (const prefixedColumn of Object.values(allPrefixedColumns)) {
      const column = prefixedColumn.substring(prefixedColumn.indexOf('.') + 1)
      const alias = columnToAliasMapping[column];
      unmarshalledRow[alias] = row[prefixedColumn];
    }

    return unmarshalledRow;
  }

  const prefixedColumns = {
    all: allPrefixedColumns,
    get(alias: keyof AliasToColumnType) {
      const column = aliasToColumn[alias];
      return allPrefixedColumns[`${tableName}.${column as string}`];
    },
    unmarshal
  };

  return {
    name: tableName,
    columns: aliasToColumn,
    writeColumns,
    prefixedColumns,
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
