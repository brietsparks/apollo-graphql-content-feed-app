import { Knex } from 'knex';

export interface CursorPaginationParams<FieldType extends string = string> {
  field: FieldType;
  direction: SortDirection;
  cursor?: Cursor;
  limit: number;
}

export interface Cursors<T extends Cursor = Cursor> {
  start?: T;
  end?: T;
  next?: T;
}

export interface Predicate {
  orderBy: OrderBy;
  limit: number;
  where: Where;
}

export type Cursor = Knex.Value;

export type OrderBy = [string, SortDirection];

export type SortDirection = 'asc' | 'desc';

export type Where = [string, string, Cursor];

export interface GetCursorsOptions {
  field?: string;
}

export function makeCursorPagination<ColumnType extends string = string>(params: CursorPaginationParams<ColumnType>) {
  const orderBy: OrderBy = [params.field, params.direction];
  const comparator = params.direction === 'asc' ? '>=' : '<=';
  const where: Where = params.cursor ? [params.field, comparator, params.cursor] : [true] as any;

  const specifiedLimit = params.limit;
  const queriedLimit = params.limit + 1; // +1 to get the next cursor

  const predicate: Predicate = {
    orderBy,
    limit: queriedLimit,
    where
  };

  function getCursors<RowType extends Record<string, unknown>>(rows: RowType[], opts?: GetCursorsOptions): Cursors {
    if (rows.length === 0) {
      return {
        start: params.cursor,
        end: params.cursor,
        next: undefined,
      };
    }

    const field = opts?.field || params.field;

    if (rows.length <= specifiedLimit) {
      return {
        start: params.cursor,
        end: rows[rows.length - 1][field] as Cursor,
        next: undefined
      };
    }

    if (rows.length === queriedLimit) {
      return {
        start: params.cursor,
        end: rows[specifiedLimit - 1][field] as Cursor,
        next: rows[queriedLimit - 1][field] as Cursor
      };
    }

    throw new Error('invalid cursor pagination state in getCursors. This is probably a bug with the library');
  }

  function getRows<RowType extends Record<string, unknown>>(rows: RowType[]): RowType[] {
    if (rows.length === 0) {
      return [];
    }

    if (rows.length <= specifiedLimit) {
      return rows;
    }

    if (rows.length === queriedLimit) {
      const returnableItems = [...rows];
      returnableItems.pop();
      return returnableItems;
    }

    throw new Error('invalid cursor pagination state in getItems. This is probably a bug with the library');
  }

  // function getResult<RowType extends Record<string, unknown>>(retrievedItems: RowType[], opts?: GetCursorsOptions): CursorPaginationResult<RowType> {
  //   return {
  //     items: getRows<RowType>(retrievedItems),
  //     cursors: getCursors<RowType>(retrievedItems, opts),
  //   }
  // }

  return {
    ...predicate,
    getRows,
    getCursors,
    // getResult,
  };
}
















