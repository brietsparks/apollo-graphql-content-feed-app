import { knex, Knex } from 'knex';
import { Without } from '../util/types';
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

const postsTable = {} as any;

const db = knex({});

const ownerId = '';

const query1Columns = postsTable.aliased();
const query2Columns = query1Columns.aliased();

(async function () {
  const rows = await db
    .from((subquery: Knex) => {
      return subquery
        .from(postsTable.name)
        .select(query1Columns.select('*'))
        .where({
          [query1Columns.where('ownerId')]: ownerId
        })
        .as('subquery')
    })
    .select(query2Columns.select('*'))
    .where(query2Columns.where({
      'myColumn': 'some value'
    }));

  query2Columns.unalias(rows)
})()

export type Attribute<T> = keyof T;
export type AttributeToPrefixedAliasLookup<T> = Record<Attribute<T>, string>;
export type AttributeToPrefixedColumnLookup<T> = Record<Attribute<T>, string>;

export type Selection<T> = ('*' | Attribute<T>)[];

export class TableAliasHelper<T extends Record<string, string>> {
  private attributeToPrefixedAliasLookup: AttributeToPrefixedAliasLookup<T>;

  constructor(
    public tableName: string,
    private caseLookup: T,
    private delimiter: string = ':'
  ) {
    this.attributeToPrefixedAliasLookup = this.buildAttributeToPrefixedAliasLookup(caseLookup);
  }

  get name() {
    return this.tableName;
  }

  aliased(delimiter = ':') {
    return new TableAliasHelper(this.tableName, this.caseLookup, `${delimiter}${this.delimiter}`);
  }

  select(...selection: Selection<T>) {
    return selection;
  }

  private buildAttributeToPrefixedAliasLookup(caseLookup: T): AttributeToPrefixedAliasLookup<T> {
    const attributeToPrefixedAliasLookup: Partial<AttributeToPrefixedAliasLookup<T>> = {};
    for (const attribute of Object.keys(caseLookup)) {
      attributeToPrefixedAliasLookup[attribute as Attribute<T>] = `${this.tableName}${this.delimiter}${attribute}`;
    }
    return attributeToPrefixedAliasLookup as AttributeToPrefixedAliasLookup<T>;
  }

  private buildAttributeToPrefixedColumnLookup(caseLookup: T): AttributeToPrefixedColumnLookup<T> {
    const attributeToPrefixedColumnLookup: Partial<AttributeToPrefixedColumnLookup<T>> = {};
    for (const attribute of Object.keys(caseLookup)) {
      attributeToPrefixedColumnLookup[attribute as Attribute<T>] = `${this.tableName}${this.delimiter}${attribute}`;
    }
    return attributeToPrefixedColumnLookup as AttributeToPrefixedAliasLookup<T>;
  }
}
