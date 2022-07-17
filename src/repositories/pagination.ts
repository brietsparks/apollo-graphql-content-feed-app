export interface CursorPaginationResult {
  // cursorPrev?: string;
  cursorStart: string;
  cursorEnd: string;
  // cursorNext?: string;
  // hasPrev: boolean;
  hasNext: boolean;
}

export interface CursorPaginatedItems<T> {
  items: T[];
  pagination: CursorPaginationResult;
}
