export type Attribute<T> = keyof T;
export type RawColumn<T> = T[keyof T];

type PrefixedColumnLookup<T> = Record<Attribute<T>, string>;
type AttributeLookup<T> = Record<string, Attribute<T>>;
type AttributeCasedRow<T> = Record<Attribute<T>, unknown>;

export class Table<T extends Record<string, string>> {
  prefixedColumnLookup: PrefixedColumnLookup<T>;
  attributeLookup: AttributeLookup<T>;

  constructor(
    public name: string,
    private columnLookup: T,
  ) {
    const { prefixedColumnLookup, attributeLookup } = this.buildLookups(columnLookup);
    this.prefixedColumnLookup = prefixedColumnLookup;
    this.attributeLookup = attributeLookup;
  }

  rawColumns = (...attributes: Attribute<T>[]) => {
    const rawColumns: Partial<Record<Attribute<T>, RawColumn<T>>> = {};
    for (const attribute of attributes) {
      rawColumns[attribute] = this.columnLookup[attribute];
    }
    return rawColumns;
  };

  rawColumn(attribute: Attribute<T>) {
    return this.columnLookup[attribute];
  }

  prefixedColumns = (...attributes: Attribute<T>[]) => {
    const prefixedColumnsArr = attributes.length
      ? attributes.map(attribute => this.getPrefixedColumn(attribute))
      : Object.values(this.prefixedColumnLookup)

    const prefixedColumns: Record<string, string> = {};
    for (const prefixedColumn of prefixedColumnsArr) {
      prefixedColumns[prefixedColumn] = prefixedColumn;
    }
    return prefixedColumns;
  }

  prefixedColumn = (attribute: Attribute<T>) => {
    return this.prefixedColumnLookup[attribute];
  }

  toAttributeCase = <U extends Partial<Record<Attribute<T>, unknown>>>(row: Record<string, unknown>): U => {
    const attributeCasedRow: Partial<AttributeCasedRow<T>> = {};
    for (const [prefixColumn, value] of Object.entries(row)) {
      const attribute = this.getAttribute(prefixColumn);
      attributeCasedRow[attribute] = value;
    }
    return attributeCasedRow as U;
  }

  toColumnCase = (row: Partial<AttributeCasedRow<T>>): Record<RawColumn<T>, unknown> => {
    const columnCasedRow: Partial<Record<RawColumn<T>, unknown>> = {};
    for (const [attribute, value] of Object.entries(row)) {
      const rawColumn = this.rawColumn(attribute);
      columnCasedRow[rawColumn] = value;
    }
    return columnCasedRow as Record<RawColumn<T>, unknown>;
  }

  private buildLookups(columnLookup: T) {
    const prefixedColumnLookup: Partial<PrefixedColumnLookup<T>> = {}
    const attributeLookup: Partial<AttributeLookup<T>> = {};
    for (const [attribute, column] of Object.entries(columnLookup)) {
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
