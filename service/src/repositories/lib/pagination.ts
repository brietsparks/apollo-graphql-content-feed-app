import { Knex } from 'knex';
import { XOR } from '../../util/types';

export interface CursorPaginationParams<FieldType extends string = string> {
  field: FieldParam<FieldType>;
  direction: SortDirection;
  cursor?: Cursor;
  limit: number;
}

export type FieldParam<FieldType> = XOR<string, AliasedField<FieldType>>

export interface AliasedField<FieldType> {
  alias: FieldType;
  column: string;
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

export function makeCursorPagination<FieldType extends string = string>(params: CursorPaginationParams<FieldType>) {
  const predicateField = typeof params.field === 'string' ? params.field : params.field.column;

  const orderBy: OrderBy = [predicateField, params.direction];
  const comparator = params.direction === 'asc' ? '>=' : '<=';
  const where: Where = params.cursor ? [predicateField, comparator, params.cursor] : [true] as any;

  const specifiedLimit = params.limit;
  const queriedLimit = params.limit + 1; // +1 to get the next cursor

  const predicate: Predicate = {
    orderBy,
    limit: queriedLimit,
    where
  };

  function getCursors<RowType extends Record<string, unknown>>(rows: RowType[], opts?: GetCursorsOptions): Cursors {
    const cursorField = opts?.field
      ? opts.field
      : params.field === 'string' ? params.field : (params.field as AliasedField<FieldType>).alias;

    if (rows.length === 0) {
      return {
        start: params.cursor,
        end: params.cursor,
        next: undefined,
      };
    }

    if (rows.length <= specifiedLimit) {
      return {
        start: params.cursor,
        end: rows[rows.length - 1][cursorField] as Cursor,
        next: undefined
      };
    }

    if (rows.length === queriedLimit) {
      return {
        start: params.cursor,
        end: rows[specifiedLimit - 1][cursorField] as Cursor,
        next: rows[queriedLimit - 1][cursorField] as Cursor
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

  return {
    ...predicate,
    getRows,
    getCursors,
  };
}
















