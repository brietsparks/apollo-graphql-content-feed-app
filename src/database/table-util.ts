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
    const columnsArr = attributes.length
      ? attributes.map(attribute => this.getPrefixedColumn(attribute))
      : Object.values(this.prefixedColumnLookup)

    const columns: Record<string, string> = {};
    for (const column of columnsArr) {
      columns[column] = column;
    }
    return columns;
  }

  column(attribute: Attribute<T>) {
    return this.prefixedColumnLookup[attribute];
  }

  toAttributeCase<U extends Partial<Record<Attribute<T>, unknown>>>(row: Record<string, unknown>): U {
    const attributeCasedRow: Partial<AttributeCasedRow<T>> = {};
    for (const [prefixColumn, value] of Object.entries(row)) {
      const attribute = this.getAttribute(prefixColumn);
      attributeCasedRow[attribute] = value;
    }
    return attributeCasedRow as U;
  }

  toColumnCase(row: Partial<AttributeCasedRow<T>>): Record<string, unknown> {
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

  private getPrefixedColumn(attribute: Attribute<T>) {
    return this.prefixedColumnLookup[attribute];
  }

  private getAttribute(prefixedColumn: string) {
    return this.attributeLookup[prefixedColumn];
  }
}
