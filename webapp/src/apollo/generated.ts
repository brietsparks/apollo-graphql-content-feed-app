import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ContentItem = Image | Post;

export type CreateImageParams = {
  caption?: InputMaybe<Scalars['String']>;
  ownerId: Scalars['String'];
  url: Scalars['String'];
};

export type CreatePostParams = {
  body?: InputMaybe<Scalars['String']>;
  ownerId: Scalars['String'];
  tagIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title: Scalars['String'];
};

export type CreateTagParams = {
  name: Scalars['String'];
};

export type CreateUserParams = {
  name: Scalars['String'];
};

export type CursorPaginatedContentItems = {
  __typename?: 'CursorPaginatedContentItems';
  cursors: Cursors;
  items: Array<ContentItem>;
};

export type CursorPaginatedImages = {
  __typename?: 'CursorPaginatedImages';
  cursors: Cursors;
  items: Array<Image>;
};

export type CursorPaginatedPosts = {
  __typename?: 'CursorPaginatedPosts';
  cursors: Cursors;
  items: Array<Post>;
};

export type CursorPaginatedUsers = {
  __typename?: 'CursorPaginatedUsers';
  cursors: Cursors;
  items: Array<User>;
};

export type CursorPaginationInput = {
  cursor?: InputMaybe<Scalars['String']>;
  field?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  sortDirection?: InputMaybe<SortDirection>;
};

export type Cursors = {
  __typename?: 'Cursors';
  end?: Maybe<Scalars['String']>;
  next?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['String']>;
};

export type GetContentItemsParams = {
  ownerId?: InputMaybe<Scalars['String']>;
  pagination: CursorPaginationInput;
};

export type GetImagesParams = {
  ownerId?: InputMaybe<Scalars['String']>;
  pagination: CursorPaginationInput;
};

export type GetPostsParams = {
  ownerId?: InputMaybe<Scalars['String']>;
  pagination: CursorPaginationInput;
  tagId?: InputMaybe<Scalars['String']>;
};

export type Image = {
  __typename?: 'Image';
  caption?: Maybe<Scalars['String']>;
  creationTimestamp: Scalars['String'];
  id: Scalars['String'];
  owner: User;
  ownerId: Scalars['String'];
  tags: Array<Tag>;
  url: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createImage: Image;
  createPost: Post;
  createTag: Tag;
  createUser: User;
};


export type MutationCreateImageArgs = {
  params: CreateImageParams;
};


export type MutationCreatePostArgs = {
  params: CreatePostParams;
};


export type MutationCreateTagArgs = {
  params: CreateTagParams;
};


export type MutationCreateUserArgs = {
  params: CreateUserParams;
};

export type OffsetPaginatedUsers = {
  __typename?: 'OffsetPaginatedUsers';
  items: Array<User>;
};

export type OffsetPaginationInput = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sortDirection?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<Scalars['String']>;
};

export type PageOffsetPaginationInput = {
  cursors?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  sortDirection?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<Scalars['String']>;
};

export type Post = {
  __typename?: 'Post';
  body?: Maybe<Scalars['String']>;
  creationTimestamp: Scalars['String'];
  id: Scalars['String'];
  owner: User;
  ownerId: Scalars['String'];
  tags: Array<Tag>;
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getContentItems: CursorPaginatedContentItems;
  getImage?: Maybe<Image>;
  getImages: CursorPaginatedImages;
  getPost?: Maybe<Post>;
  getPosts: CursorPaginatedPosts;
  getTag?: Maybe<Tag>;
  getUser?: Maybe<User>;
  getUsers: CursorPaginatedUsers;
};


export type QueryGetContentItemsArgs = {
  params: GetContentItemsParams;
};


export type QueryGetImageArgs = {
  id: Scalars['String'];
};


export type QueryGetImagesArgs = {
  params: GetImagesParams;
};


export type QueryGetPostArgs = {
  id: Scalars['String'];
};


export type QueryGetPostsArgs = {
  params: GetPostsParams;
};


export type QueryGetTagArgs = {
  id: Scalars['String'];
};


export type QueryGetUserArgs = {
  id: Scalars['String'];
};


export type QueryGetUsersArgs = {
  pagination: CursorPaginationInput;
};

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type SortInput = {
  direction: SortDirection;
  field: Scalars['String'];
};

export type Tag = {
  __typename?: 'Tag';
  creationTimestamp: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  recentPosts: Array<Post>;
};

export type User = {
  __typename?: 'User';
  creationTimestamp: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  recentContentItems: Array<ContentItem>;
  recentImages: Array<Image>;
  recentPosts: Array<Post>;
};

export type CreateUserMutationVariables = Exact<{
  params: CreateUserParams;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, creationTimestamp: string, name: string } };

export type GetUserQueryVariables = Exact<{
  params: Scalars['String'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser?: { __typename?: 'User', id: string, creationTimestamp: string, name: string } | null };

export type GetUsersQueryVariables = Exact<{
  params: CursorPaginationInput;
}>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: { __typename?: 'CursorPaginatedUsers', items: Array<{ __typename?: 'User', id: string, name: string, creationTimestamp: string }>, cursors: { __typename?: 'Cursors', start?: string | null, end?: string | null, next?: string | null } } };


export const CreateUserDocument = gql`
    mutation createUser($params: CreateUserParams!) {
  createUser(params: $params) {
    id
    creationTimestamp
    name
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      params: // value for 'params'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const GetUserDocument = gql`
    query getUser($params: String!) {
  getUser(id: $params) {
    id
    creationTimestamp
    name
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      params: // value for 'params'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const GetUsersDocument = gql`
    query getUsers($params: CursorPaginationInput!) {
  getUsers(pagination: $params) {
    items {
      id
      name
      creationTimestamp
    }
    cursors {
      start
      end
      next
    }
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *      params: // value for 'params'
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;