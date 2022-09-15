type ValueOf<T> = T[keyof T];
type Attribute<T> = keyof T;
type PrefixedColumnLookup<T> = Record<Attribute<T>, string>;

export class Table<T extends Record<string, string>> {
  attributes: Attribute<T>;
  prefixedColumnLookup: PrefixedColumnLookup<T>;

  constructor(
    public name: string,
    private config: T,
  ) {
    this.prefixedColumnLookup = this.buildPrefixedColumnLookup(config);
  }

  columns(...attributes: Attribute<T>[]) {
    if (!attributes) {
      return this.getAllPrefixedColumns();
    }
    return attributes.map(attribute => this.getPrefixedColumn(attribute));
  }

  private buildPrefixedColumnLookup(config: T) {
    const prefixedColumnLookup: Partial<PrefixedColumnLookup<T>> = {}
    for (const [attribute, column] of Object.entries(config)) {
      prefixedColumnLookup[attribute as Attribute<T>] = `${this.name}.${column}`;
    }
    return prefixedColumnLookup as PrefixedColumnLookup<T>;
  }

  private getPrefixedColumn(attribute: Attribute<T>) {
    return this.prefixedColumnLookup[attribute];
  }

  private getAllPrefixedColumns() {
    return Object.values(this.prefixedColumnLookup);
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
