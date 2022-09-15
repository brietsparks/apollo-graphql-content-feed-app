type Attribute<T> = keyof T;
type PrefixedColumnLookup<T> = Record<Attribute<T>, string>;
type AttributeLookup<T> = Record<string, Attribute<T>>;

type AttributeCasedRow<T> = Record<Attribute<T>, unknown>;

export class Table<T extends Record<string, string>> {
  prefixedColumnLookup: PrefixedColumnLookup<T>;
  attributeLookup: AttributeLookup<T>;

  constructor(
    public name: string,
    private config: T,
  ) {
    const { prefixedColumnLookup, attributeLookup } = this.buildLookups(config);
    this.prefixedColumnLookup = prefixedColumnLookup;
    this.attributeLookup = attributeLookup;
  }

  columns(...attributes: Attribute<T>[]) {
    if (!attributes.length) {
      return this.getAllPrefixedColumns();
    }
    return attributes.map(attribute => this.getPrefixedColumn(attribute));
  }

  column(attribute: Attribute<T>) {
    return this.columns(attribute)[0];
  }

  toAttributeCase<U extends Record<Attribute<T>, unknown>>(row: Record<string, unknown>): U {
    const attributeCasedRow: Partial<AttributeCasedRow<T>> = {};
    for (const [prefixColumn, value] of Object.entries(row)) {
      const attribute = this.getAttribute(prefixColumn);
      attributeCasedRow[attribute] = value;
    }
    return attributeCasedRow as U;
  }

  toColumnCase(row: AttributeCasedRow<T>): Record<string, unknown> {
    const columnCasedRow: Record<string, unknown> = {};
    for (const [attribute, value] of Object.entries(row)) {
      const prefixedColumn = this.getPrefixedColumn(attribute);
      columnCasedRow[prefixedColumn] = value;
    }
    return columnCasedRow;
  }

  private buildLookups(config: T) {
    const prefixedColumnLookup: Partial<PrefixedColumnLookup<T>> = {}
    const attributeLookup: Partial<AttributeLookup<T>> = {};
    for (const [attribute, column] of Object.entries(config)) {
      const prefixedColumn = `${this.name}.${column}`;
      prefixedColumnLookup[attribute as Attribute<T>] = prefixedColumn;
      attributeLookup[prefixedColumn] = attribute;
    }
    return {
      prefixedColumnLookup: prefixedColumnLookup as PrefixedColumnLookup<T>,
      attributeLookup: attributeLookup as AttributeLookup<T>,
    };
  }

  private build

  private getPrefixedColumn(attribute: Attribute<T>) {
    return this.prefixedColumnLookup[attribute];
  }

  private getAllPrefixedColumns() {
    return Object.values(this.prefixedColumnLookup);
  }

  private getAttribute(prefixedColumn: string) {
    return this.attributeLookup[prefixedColumn];
  }
}

const postsTable = new Table('posts', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  oogabooga: 'ooga_booga'
});

postsTable.columns('creationTimestamp', 'id', 'oogabooga');

/*
.select(postsTable.columns)

.select(
  'posts.id',
  'posts.creationTimestamp'
)
*/

/*
postTagsTable.prefixedColumns.get('postId')

'posts.id'

{ postId: 'posts.id' }
*/

/*
CursorPaginationParams<Post>

{
  'posts.id': unknown,
  'posts.creationTimestamp': unknown
}
*/

/*
dtoa
unmarshall({
  'posts.id': '...',
  'posts.creation_timestamp': '...'
})

{
  'posts.id': 'id',
  'posts.creation_timestamp': 'creationTimestamp'
}
*/

/*
atod
write({
  id: '...'
  creationTimestamp: '...'
})

{
  'id': 'posts.id',
  'creationTimestamp': 'posts.creation_timestamp'
}
*/
