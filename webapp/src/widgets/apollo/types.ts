import { generated } from '~/apollo';

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type GetPostsQueryItem = ArrayElement<generated.GetPostsQuery['getPosts']['items']>;

export type GetImagesQueryItem = ArrayElement<generated.GetImagesQuery['getImages']['items']>;

