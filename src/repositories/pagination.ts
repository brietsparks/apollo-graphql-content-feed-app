import { invert } from 'lodash';

export type SortDirection = 'asc' | 'desc';

export interface Sort<T extends string[]> {
  field: T;
  direction: SortDirection;
}

export interface CursorPaginationResult<RecordType, CursorType = any> {
  items: RecordType[];
  page: CursorPage<CursorType>;
}

export interface CursorPaginationParams<CursorType = any> {
  field: string;
  sortDirection: SortDirection;
  cursor?: CursorType;
  limit: number;
  fieldmap?: Record<string, string>;
}

export type CursorPagination<RecordType, CursorType> =
  Predicate<CursorType> & {
  getResult: (items: RecordType[]) => CursorPaginationResult<RecordType>;
  getPage: (items: RecordType[]) => CursorPage<CursorType>;
  getItems: (items: RecordType[]) => RecordType[];
}

export interface CursorPage<CursorType> {
  start?: CursorType;
  end?: CursorType;
  next?: CursorType;
}

export interface Predicate<CursorType> {
  orderBy: OrderBy;
  limit: number;
  where: Where<CursorType>;
}

export type Comparator = '>=' | '<=';

export type OrderBy = [string, SortDirection];

export type Where<CursorType> = [string, Comparator, CursorType];

export function makeCursorPagination<RecordType, CursorType = any>(params: CursorPaginationParams<CursorType>): CursorPagination<RecordType, CursorType> {
  const comparator: Comparator = params.sortDirection === 'asc' ? '>=' : '<=';
  const orderBy: OrderBy = [params.field, params.sortDirection];
  const where: Where<CursorType> = params.cursor ? [params.field, comparator, params.cursor] : ([1, '=', 1] as any);

  const specifiedLimit = params.limit;
  const queriedLimit = params.limit + 1; // +1 to get the next cursor

  const predicate: Predicate<CursorType> = {
    orderBy,
    limit: queriedLimit,
    where
  };

  function getPage(retrievedItems: unknown[]): CursorPage<CursorType> {
    if (retrievedItems.length === 0) {
      return {
        start: params.cursor,
        end: params.cursor,
        next: undefined,
      };
    }

    const itemCursorField = params.fieldmap ? invert(params.fieldmap)[params.field] : params.field;

    if (retrievedItems.length <= specifiedLimit) {
      return {
        start: params.cursor,
        end: retrievedItems[retrievedItems.length - 1][itemCursorField],
        next: undefined
      };
    }

    if (retrievedItems.length === queriedLimit) {
      return {
        start: params.cursor,
        end: retrievedItems[specifiedLimit - 1][itemCursorField],
        next: retrievedItems[queriedLimit - 1][itemCursorField]
      };
    }

    throw new Error('invalid cursor pagination state');
  }


  function getItems(retrievedItems: RecordType[]): RecordType[] {
    if (retrievedItems.length === 0) {
      return [];
    }

    if (retrievedItems.length <= specifiedLimit) {
      return retrievedItems;
    }

    if (retrievedItems.length === queriedLimit) {
      const returnableItems = [...retrievedItems];
      returnableItems.pop();
      return returnableItems;
    }

    throw new Error('invalid cursor pagination state');
  }

  function getResult(retrievedItems: RecordType[]): CursorPaginationResult<RecordType> {
    return {
      items: getItems(retrievedItems),
      page: getPage(retrievedItems)
    }
  }

  return {
    ...predicate,
    getResult,
    getPage,
    getItems,
  };
}
