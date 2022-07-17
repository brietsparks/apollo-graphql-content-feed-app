export interface CursorPaginationParams<T> {
  cursor?: T;
  limit: number;
}

export interface CursorPaginationResult {
  prev?: string;
  start?: string;
  end?: string;
  next?: string;
}

export interface CursorPaginatedItems<T> {
  items: T[];
  pagination: CursorPaginationResult;
}

export type Comparator = '>=' | '<=';

export function makePagination<T>(column: string, sortDirection: 'asc' | 'desc', params: CursorPaginationParams<T>) {
  const comparator = sortDirection === 'asc' ? '>=' : '<=';
  const orderBy: [string, Comparator] = [column, comparator]
  const where: [any, string, any] = params.cursor ? [column, comparator, params.cursor] : [1, '=', 1];

  const predicate = {
    orderBy,
    limit: params.limit,
    where
  };


  function getPaginatedItems<T>(retrievedItems: unknown[]) {
    if (retrievedItems.length === 0) {
    return {
      items: [],
      pagination: {
        hasNext: false,
        cursorStart: params.cursor,
        cursorNext: params.cursor
      }
    }
  }

  if (retrievedItems.length <= this.params.limit) {
    return {
      items: retrievedItems as T[],
      pagination: {
        hasMore: false,
        cursor: retrievedItems[retrievedItems.length - 1][this.params.field]
      }
    }
  }

  const hasMore = retrievedItems.length > this.params.limit;

  const returnableItems = [...retrievedItems];
  returnableItems.pop();
  const cursor = returnableItems[returnableItems.length - 1][this.params.field];

  return {
    items: returnableItems as T[],
    pagination: {
      hasMore,
      cursor
    }
  };
}

  return {
    ...predicate,
    getPaginatedItems
  };
}



// export class Pagination {
//   constructor(
//     public column: string,
//     public sortDirection: 'asc' | 'desc',
//     public params: CursorPaginationParams
//   ) {}
//
//   getPredicate() {
//     const comparator = this.sortDirection === 'asc' ? '>=' : '<=';
//     return {
//       orderBy: [this.column, comparator],
//       limit: this.params.limit,
//       where: [this.column, comparator, this.params.cursor]
//     }
//   }
//
//   getPaginatedItems<T>(retrievedItems: unknown[]) {
//     if (retrievedItems.length === 0) {
//       return {
//         items: [],
//         pagination: {
//           hasMore: false,
//           cursor: this.params.cursor
//         }
//       }
//     }
//
//     if (retrievedItems.length <= this.params.limit) {
//       return {
//         items: retrievedItems as T[],
//         pagination: {
//           hasMore: false,
//           cursor: retrievedItems[retrievedItems.length - 1][this.column]
//         }
//       }
//     }
//
//     const hasMore = retrievedItems.length > this.params.limit;
//
//     const returnableItems = [...retrievedItems];
//     returnableItems.pop();
//     const cursor = returnableItems[returnableItems.length - 1][this.column];
//
//     return {
//       items: returnableItems as T[],
//       pagination: {
//         hasMore,
//         cursor
//       }
//     };
//   }
// }
