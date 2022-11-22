import * as schema from '../../graphql';

export type AdaptCursorPaginationResult<T extends Record<string, unknown>> =
  Omit<schema.CursorPaginationInput, 'field'> & {
  field?: keyof T
}

export function adaptCursorPagination<T extends Record<string, unknown>>(paginationInput: schema.CursorPaginationInput): AdaptCursorPaginationResult<T> {
  if (Object.keys(paginationInput).includes('field')) {
    return {
      ...paginationInput,
      field: paginationInput.field as keyof T
    }
  } else {
    return paginationInput;
  }
}
