import { Cursors } from './lib/pagination';

export interface CursorPaginationResult<RowType extends Record<string, unknown>> {
  items: RowType[];
  cursors: Cursors;
}
