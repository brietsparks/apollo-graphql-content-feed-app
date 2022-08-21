// todo: deprecated, delete this

import { CursorPaginationParams as BaseCursorPaginationParams } from './pagination';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type CursorPaginationParams<CursorType = any> =
  PartialBy<BaseCursorPaginationParams<CursorType>, 'field' | 'sortDirection' | 'limit'>

export function makeCursorPaginationParamCreator<CursorType = any>(
  defaults: Pick<BaseCursorPaginationParams<CursorType>, 'field' | 'sortDirection' | 'limit'>
) {
  return function createCursorPaginationParams(
    inputParams: CursorPaginationParams<CursorType>
  ) {
    return {
      ...defaults,
      ...inputParams
    };
  }
}
