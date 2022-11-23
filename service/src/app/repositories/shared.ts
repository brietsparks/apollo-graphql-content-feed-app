import { Cursors } from '~/lib/knex';

export interface CursorPaginationResult<RowType extends Record<string, unknown>> {
  items: RowType[];
  cursors: Cursors;
}
