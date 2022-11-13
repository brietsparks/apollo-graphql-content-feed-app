// import { knex, Knex } from 'knex';
// import { Without } from '../util/types';
/*

    'posts:id': 'posts.id',
    'posts:ownerId': 'posts.owner_id',

  'posts::id': 'post:id',
  'posts::ownerId': 'post:ownerId',

'posts:::id': 'post::id',
'posts:::ownerId': 'post::ownerId',

parse
  posts:id --> id
  posts:ownerId --> ownerId

  posts::id --> id
  posts::ownerId --> ownerId

  posts:::id --> id
  posts:::ownerId --> ownerId
 */

// const postsTable = {} as any;
//
// const db = knex({});
//
// const ownerId = '';
//
// const query1Columns = postsTable.aliased();
// const query2Columns = query1Columns.aliased();
//
// (async function () {
//   const rows = await db
//     .from((subquery: Knex) => {
//       return subquery
//         .from(postsTable.name)
//         .select(query1Columns.select('*'))
//         .where({
//           [query1Columns.where('ownerId')]: ownerId
//         })
//         .as('subquery')
//     })
//     .select(query2Columns.select('*'))
//     .where(query2Columns.where({
//       'myColumn': 'some value'
//     }));
//
//   query2Columns.unalias(rows)
// })()

/*

alias -> column
ownerId -> owner_id

h1
  prefixedAlias -> prefixedColumn
  posts:ownerId -> posts.owner_id

  prefixedAlias -> alias
  posts:ownerId -> ownerId

h2
  prefixedAlias -> prefixedColumn
  posts::ownerId -> posts:ownerId

  prefixedAlias -> alias
  posts::ownerId -> ownerId

 */

import { invert } from 'lodash';

export type Alias<T> = keyof T;
export type AliasToPrefixedAliasLookup<T> = Record<Alias<T>, string>;
export type PrefixedAliasToAliasLookup<T> = Record<string, Alias<T>>;
export type AliasToPrefixedColumnLookup<T> = Record<Alias<T>, string>;
export type PrefixedAliasToPrefixedColumnLookup = Record<string, string>;

export type SelectionAliases<T> = ('*' | Alias<T>)[];

export type AliasedRow<T> = Record<Alias<T>, unknown>;

export interface TableAliasHelperConfig {
  columnDelimiter: string;
  rootAliasToColumn: Record<string, string>;
}

export class TableAliasHelper<T extends Record<string, string>> {
  private readonly aliasToPrefixedAliasLookup: AliasToPrefixedAliasLookup<T>;
  private readonly prefixedAliasToAliasLookup: PrefixedAliasToAliasLookup<T>
  private readonly aliasToPrefixedColumnLookup: AliasToPrefixedColumnLookup<T>;
  private readonly prefixedAliasToPrefixedColumnLookup: PrefixedAliasToPrefixedColumnLookup;
  private config: TableAliasHelperConfig;

  constructor(
    public tableName: string,
    private aliasToColumn: T,
    private aliasDelimiter: string = ':',
    config?: TableAliasHelperConfig,
  ) {
    this.config = config || {
      columnDelimiter: '.',
      rootAliasToColumn: aliasToColumn,
    };
    this.aliasToPrefixedAliasLookup = this.buildAliasToPrefixedAliasLookup(aliasToColumn);
    this.prefixedAliasToAliasLookup = this.buildPrefixedAliasToAliasLookup(aliasToColumn);
    this.aliasToPrefixedColumnLookup = this.buildAliasToPrefixedColumnLookup(aliasToColumn);
    this.prefixedAliasToPrefixedColumnLookup = this.buildPrefixedAliasToPrefixedColumnLookup(aliasToColumn);

  }

  get name() {
    return this.tableName;
  }

  wrap(delimiter = ':') {
    return new TableAliasHelper(
      this.tableName,
      this.aliasToColumn,
      `${delimiter}${this.aliasDelimiter}`,
      {
        columnDelimiter: this.aliasDelimiter,
        rootAliasToColumn: this.aliasToColumn
      }
    );
  }

  select(...aliases: SelectionAliases<T>) {
    if (aliases[0] === '*') {
      return this.prefixedAliasToPrefixedColumnLookup;
    }

    const selection: Partial<PrefixedAliasToPrefixedColumnLookup> = {};
    for (const alias of aliases) {
      const prefixedColumn = this.aliasToPrefixedColumnLookup[alias];
      if (prefixedColumn) {
        const prefixedAlias = this.getPrefixedAlias(alias as string);
        selection[prefixedAlias] = prefixedColumn;
      }
    }

    return selection;
  }

  predicate(alias: Alias<T>) {
    return this.aliasToPrefixedColumnLookup[alias];
  }

  toAlias<U extends Partial<AliasedRow<T>>>(row: Record<string, unknown>) {
    const aliasedRow: Partial<AliasedRow<T>> = {};
    for (const [prefixedAlias, value] of Object.entries(row)) {
      const alias = this.prefixedAliasToAliasLookup[prefixedAlias];
      if (alias) {
        aliasedRow[alias] = value;
      }
    }
    return aliasedRow as U;
  }

  private buildAliasToPrefixedAliasLookup(aliasToColumnLookup: T): AliasToPrefixedAliasLookup<T> {
    const aliasToPrefixedAliasLookup: Partial<AliasToPrefixedAliasLookup<T>> = {};
    for (const alias of Object.keys(aliasToColumnLookup)) {
      aliasToPrefixedAliasLookup[alias as Alias<T>] = this.getPrefixedAlias(alias);
    }
    return aliasToPrefixedAliasLookup as AliasToPrefixedAliasLookup<T>;
  }

  private buildPrefixedAliasToAliasLookup(aliasToColumnLookup: T): PrefixedAliasToAliasLookup<T> {
    const aliasToPrefixedAliasLookup = this.buildAliasToPrefixedAliasLookup(aliasToColumnLookup);
    return invert(aliasToPrefixedAliasLookup);
  }

  private buildAliasToPrefixedColumnLookup(aliasToColumnLookup: T): AliasToPrefixedColumnLookup<T> {
    const aliasToPrefixedColumnLookup: Partial<AliasToPrefixedColumnLookup<T>> = {};
    for (const alias of Object.keys(aliasToColumnLookup)) {
      aliasToPrefixedColumnLookup[alias as Alias<T>] = this.getPrefixedColumn(alias);
    }
    return aliasToPrefixedColumnLookup as AliasToPrefixedColumnLookup<T>;
  }

  private buildPrefixedAliasToPrefixedColumnLookup(aliasToColumnLookup: T): PrefixedAliasToPrefixedColumnLookup {
    const prefixedAliasToPrefixedColumnLookup: Partial<PrefixedAliasToPrefixedColumnLookup> = {};
    for (const alias of Object.keys(aliasToColumnLookup)) {
      prefixedAliasToPrefixedColumnLookup[this.getPrefixedAlias(alias)] = this.getPrefixedColumn(alias);
    }
    return prefixedAliasToPrefixedColumnLookup as PrefixedAliasToPrefixedColumnLookup;
  }

  private getPrefixedAlias(alias: string) {
    return `${this.tableName}${this.aliasDelimiter}${alias}`;
  }

  private getPrefixedColumn(alias: string) {
    return `${this.tableName}${this.columnDelimiter}${this.aliasToColumn[alias]}`;
  }

  private get columnDelimiter() {
    return this.config.columnDelimiter;
  }
}
