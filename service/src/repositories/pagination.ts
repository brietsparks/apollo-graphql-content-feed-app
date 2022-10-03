export type SortDirection = 'asc' | 'desc';

export interface Sort<T extends string[]> {
  field: T;
  direction: SortDirection;
}

export interface CursorPaginationResult<RecordType, CursorType = any> {
  items: RecordType[];
  page: CursorPage<CursorType>;
}

export interface CursorPaginationParams<RecordType = Record<string, string>, CursorType = any> {
  field: keyof RecordType;
  sortDirection: SortDirection;
  cursor?: CursorType;
  limit: number;
  fieldmap?: Record<keyof RecordType, string>;
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

export function makeCursorPagination<RecordType, CursorType extends RecordType[keyof RecordType] = RecordType[keyof RecordType]>(params: CursorPaginationParams<RecordType, CursorType>): CursorPagination<RecordType, CursorType> {
  const column = params.fieldmap ? params.fieldmap[params.field] : params.field;
  const orderBy: OrderBy = [column as string, params.sortDirection];
  const comparator: Comparator = params.sortDirection === 'asc' ? '>=' : '<=';
  const where: Where<CursorType> = params.cursor ? [column, comparator, params.cursor] : ([1, '=', 1] as any);

  const specifiedLimit = params.limit;
  const queriedLimit = params.limit + 1; // +1 to get the next cursor

  const predicate: Predicate<CursorType> = {
    orderBy,
    limit: queriedLimit,
    where
  };

  function getPage(retrievedItems: RecordType[]): CursorPage<CursorType> {
    if (retrievedItems.length === 0) {
      return {
        start: params.cursor,
        end: params.cursor,
        next: undefined,
      };
    }

    const itemCursorField = params.field as keyof RecordType;

    if (retrievedItems.length <= specifiedLimit) {
      return {
        start: params.cursor,
        end: retrievedItems[retrievedItems.length - 1][itemCursorField] as CursorType,
        next: undefined
      };
    }

    if (retrievedItems.length === queriedLimit) {
      return {
        start: params.cursor,
        end: retrievedItems[specifiedLimit - 1][itemCursorField] as CursorType,
        next: retrievedItems[queriedLimit - 1][itemCursorField] as CursorType
      };
    }

    throw new Error('invalid cursor pagination state in getPage. This is probably a bug with the library');
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

    throw new Error('invalid cursor pagination state in getItems. This is probably a bug with the library');
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
