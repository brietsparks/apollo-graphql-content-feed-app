import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateIssueParams = {
  name: Scalars['String'];
};

export type CreateUserParams = {
  name: Scalars['String'];
};

export type CursorPage = {
  __typename?: 'CursorPage';
  end?: Maybe<Scalars['String']>;
  next?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['String']>;
};

export type CursorPaginatedUsers = {
  __typename?: 'CursorPaginatedUsers';
  items: Array<User>;
  page: CursorPage;
};

export type CursorPaginationInput = {
  cursor?: InputMaybe<Scalars['String']>;
  field?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  sortDirection?: InputMaybe<SortDirection>;
};

export type Issue = {
  __typename?: 'Issue';
  creationTimestamp: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createIssue: Issue;
  createUser: User;
};


export type MutationCreateIssueArgs = {
  params?: InputMaybe<CreateUserParams>;
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
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  sortDirection?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<Scalars['String']>;
};

export type PaginatedIssues = {
  __typename?: 'PaginatedIssues';
  items: Array<Issue>;
  page: CursorPage;
};

export type Query = {
  __typename?: 'Query';
  getIssues: PaginatedIssues;
  getUser?: Maybe<User>;
  getUsers: CursorPaginatedUsers;
  getUsersByCursor: CursorPaginatedUsers;
  getUsersByOffset: OffsetPaginatedUsers;
  getUsersByPageOffset: OffsetPaginatedUsers;
};


export type QueryGetIssuesArgs = {
  pagination: CursorPaginationInput;
};


export type QueryGetUserArgs = {
  id: Scalars['String'];
};


export type QueryGetUsersArgs = {
  pagination: CursorPaginationInput;
};


export type QueryGetUsersByCursorArgs = {
  pagination: CursorPaginationInput;
};


export type QueryGetUsersByOffsetArgs = {
  pagination: OffsetPaginationInput;
};


export type QueryGetUsersByPageOffsetArgs = {
  pagination: PageOffsetPaginationInput;
};

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type SortInput = {
  direction: SortDirection;
  field: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  creationTimestamp: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateIssueParams: CreateIssueParams;
  CreateUserParams: CreateUserParams;
  CursorPage: ResolverTypeWrapper<CursorPage>;
  CursorPaginatedUsers: ResolverTypeWrapper<CursorPaginatedUsers>;
  CursorPaginationInput: CursorPaginationInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Issue: ResolverTypeWrapper<Issue>;
  Mutation: ResolverTypeWrapper<{}>;
  OffsetPaginatedUsers: ResolverTypeWrapper<OffsetPaginatedUsers>;
  OffsetPaginationInput: OffsetPaginationInput;
  PageOffsetPaginationInput: PageOffsetPaginationInput;
  PaginatedIssues: ResolverTypeWrapper<PaginatedIssues>;
  Query: ResolverTypeWrapper<{}>;
  SortDirection: SortDirection;
  SortInput: SortInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  CreateIssueParams: CreateIssueParams;
  CreateUserParams: CreateUserParams;
  CursorPage: CursorPage;
  CursorPaginatedUsers: CursorPaginatedUsers;
  CursorPaginationInput: CursorPaginationInput;
  Int: Scalars['Int'];
  Issue: Issue;
  Mutation: {};
  OffsetPaginatedUsers: OffsetPaginatedUsers;
  OffsetPaginationInput: OffsetPaginationInput;
  PageOffsetPaginationInput: PageOffsetPaginationInput;
  PaginatedIssues: PaginatedIssues;
  Query: {};
  SortInput: SortInput;
  String: Scalars['String'];
  User: User;
};

export type CursorPageResolvers<ContextType = any, ParentType extends ResolversParentTypes['CursorPage'] = ResolversParentTypes['CursorPage']> = {
  end?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  next?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  start?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CursorPaginatedUsersResolvers<ContextType = any, ParentType extends ResolversParentTypes['CursorPaginatedUsers'] = ResolversParentTypes['CursorPaginatedUsers']> = {
  items?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  page?: Resolver<ResolversTypes['CursorPage'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IssueResolvers<ContextType = any, ParentType extends ResolversParentTypes['Issue'] = ResolversParentTypes['Issue']> = {
  creationTimestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createIssue?: Resolver<ResolversTypes['Issue'], ParentType, ContextType, RequireFields<MutationCreateIssueArgs, never>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'params'>>;
};

export type OffsetPaginatedUsersResolvers<ContextType = any, ParentType extends ResolversParentTypes['OffsetPaginatedUsers'] = ResolversParentTypes['OffsetPaginatedUsers']> = {
  items?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaginatedIssuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaginatedIssues'] = ResolversParentTypes['PaginatedIssues']> = {
  items?: Resolver<Array<ResolversTypes['Issue']>, ParentType, ContextType>;
  page?: Resolver<ResolversTypes['CursorPage'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getIssues?: Resolver<ResolversTypes['PaginatedIssues'], ParentType, ContextType, RequireFields<QueryGetIssuesArgs, 'pagination'>>;
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserArgs, 'id'>>;
  getUsers?: Resolver<ResolversTypes['CursorPaginatedUsers'], ParentType, ContextType, RequireFields<QueryGetUsersArgs, 'pagination'>>;
  getUsersByCursor?: Resolver<ResolversTypes['CursorPaginatedUsers'], ParentType, ContextType, RequireFields<QueryGetUsersByCursorArgs, 'pagination'>>;
  getUsersByOffset?: Resolver<ResolversTypes['OffsetPaginatedUsers'], ParentType, ContextType, RequireFields<QueryGetUsersByOffsetArgs, 'pagination'>>;
  getUsersByPageOffset?: Resolver<ResolversTypes['OffsetPaginatedUsers'], ParentType, ContextType, RequireFields<QueryGetUsersByPageOffsetArgs, 'pagination'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  creationTimestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CursorPage?: CursorPageResolvers<ContextType>;
  CursorPaginatedUsers?: CursorPaginatedUsersResolvers<ContextType>;
  Issue?: IssueResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  OffsetPaginatedUsers?: OffsetPaginatedUsersResolvers<ContextType>;
  PaginatedIssues?: PaginatedIssuesResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

