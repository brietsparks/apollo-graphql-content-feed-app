/*

 */


export type Post = {
  id: string;
  creationTimestamp: Date;
  ownerId: string;
  title: string;
  body: string | null;
}



function fn<P extends string, R extends Record<string, string>>(prefix: P, record: R): { [K in keyof R]: `${prefix}.${R[K]}` } {
  return {} as any
}

export function tablemapper<N extends string, M extends Record<string, string>>(tablename: N, mapping: M): Record<`${N}.${M[N]}`, string> {
  return {} as any;
}

const r = tablemapper('foo', { a: 'ok' });
