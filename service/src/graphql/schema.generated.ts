import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
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
  tagIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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

export type CursorPaginatedTags = {
  __typename?: 'CursorPaginatedTags';
  cursors: Cursors;
  items: Array<Tag>;
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

export type GetTagsParams = {
  pagination: CursorPaginationInput;
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
  getTags: CursorPaginatedTags;
  getUser?: Maybe<User>;
  getUsers: CursorPaginatedUsers;
  searchTags: CursorPaginatedTags;
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


export type QueryGetTagsArgs = {
  params?: InputMaybe<GetTagsParams>;
};


export type QueryGetUserArgs = {
  id: Scalars['String'];
};


export type QueryGetUsersArgs = {
  pagination: CursorPaginationInput;
};


export type QuerySearchTagsArgs = {
  params: SearchTagsParams;
};

export type SearchTagsParams = {
  pagination: CursorPaginationInput;
  term: Scalars['String'];
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
  recentImages: Array<Image>;
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
  ContentItem: ResolversTypes['Image'] | ResolversTypes['Post'];
  CreateImageParams: CreateImageParams;
  CreatePostParams: CreatePostParams;
  CreateTagParams: CreateTagParams;
  CreateUserParams: CreateUserParams;
  CursorPaginatedContentItems: ResolverTypeWrapper<Omit<CursorPaginatedContentItems, 'items'> & { items: Array<ResolversTypes['ContentItem']> }>;
  CursorPaginatedImages: ResolverTypeWrapper<CursorPaginatedImages>;
  CursorPaginatedPosts: ResolverTypeWrapper<CursorPaginatedPosts>;
  CursorPaginatedTags: ResolverTypeWrapper<CursorPaginatedTags>;
  CursorPaginatedUsers: ResolverTypeWrapper<CursorPaginatedUsers>;
  CursorPaginationInput: CursorPaginationInput;
  Cursors: ResolverTypeWrapper<Cursors>;
  GetContentItemsParams: GetContentItemsParams;
  GetImagesParams: GetImagesParams;
  GetPostsParams: GetPostsParams;
  GetTagsParams: GetTagsParams;
  Image: ResolverTypeWrapper<Image>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  OffsetPaginatedUsers: ResolverTypeWrapper<OffsetPaginatedUsers>;
  OffsetPaginationInput: OffsetPaginationInput;
  PageOffsetPaginationInput: PageOffsetPaginationInput;
  Post: ResolverTypeWrapper<Post>;
  Query: ResolverTypeWrapper<{}>;
  SearchTagsParams: SearchTagsParams;
  SortDirection: SortDirection;
  SortInput: SortInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  Tag: ResolverTypeWrapper<Tag>;
  User: ResolverTypeWrapper<Omit<User, 'recentContentItems'> & { recentContentItems: Array<ResolversTypes['ContentItem']> }>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  ContentItem: ResolversParentTypes['Image'] | ResolversParentTypes['Post'];
  CreateImageParams: CreateImageParams;
  CreatePostParams: CreatePostParams;
  CreateTagParams: CreateTagParams;
  CreateUserParams: CreateUserParams;
  CursorPaginatedContentItems: Omit<CursorPaginatedContentItems, 'items'> & { items: Array<ResolversParentTypes['ContentItem']> };
  CursorPaginatedImages: CursorPaginatedImages;
  CursorPaginatedPosts: CursorPaginatedPosts;
  CursorPaginatedTags: CursorPaginatedTags;
  CursorPaginatedUsers: CursorPaginatedUsers;
  CursorPaginationInput: CursorPaginationInput;
  Cursors: Cursors;
  GetContentItemsParams: GetContentItemsParams;
  GetImagesParams: GetImagesParams;
  GetPostsParams: GetPostsParams;
  GetTagsParams: GetTagsParams;
  Image: Image;
  Int: Scalars['Int'];
  Mutation: {};
  OffsetPaginatedUsers: OffsetPaginatedUsers;
  OffsetPaginationInput: OffsetPaginationInput;
  PageOffsetPaginationInput: PageOffsetPaginationInput;
  Post: Post;
  Query: {};
  SearchTagsParams: SearchTagsParams;
  SortInput: SortInput;
  String: Scalars['String'];
  Tag: Tag;
  User: Omit<User, 'recentContentItems'> & { recentContentItems: Array<ResolversParentTypes['ContentItem']> };
};

export type ContentItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContentItem'] = ResolversParentTypes['ContentItem']> = {
  __resolveType: TypeResolveFn<'Image' | 'Post', ParentType, ContextType>;
};

export type CursorPaginatedContentItemsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CursorPaginatedContentItems'] = ResolversParentTypes['CursorPaginatedContentItems']> = {
  cursors?: Resolver<ResolversTypes['Cursors'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['ContentItem']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CursorPaginatedImagesResolvers<ContextType = any, ParentType extends ResolversParentTypes['CursorPaginatedImages'] = ResolversParentTypes['CursorPaginatedImages']> = {
  cursors?: Resolver<ResolversTypes['Cursors'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['Image']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CursorPaginatedPostsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CursorPaginatedPosts'] = ResolversParentTypes['CursorPaginatedPosts']> = {
  cursors?: Resolver<ResolversTypes['Cursors'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CursorPaginatedTagsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CursorPaginatedTags'] = ResolversParentTypes['CursorPaginatedTags']> = {
  cursors?: Resolver<ResolversTypes['Cursors'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CursorPaginatedUsersResolvers<ContextType = any, ParentType extends ResolversParentTypes['CursorPaginatedUsers'] = ResolversParentTypes['CursorPaginatedUsers']> = {
  cursors?: Resolver<ResolversTypes['Cursors'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CursorsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Cursors'] = ResolversParentTypes['Cursors']> = {
  end?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  next?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  start?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = {
  caption?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  creationTimestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createImage?: Resolver<ResolversTypes['Image'], ParentType, ContextType, RequireFields<MutationCreateImageArgs, 'params'>>;
  createPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'params'>>;
  createTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'params'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'params'>>;
};

export type OffsetPaginatedUsersResolvers<ContextType = any, ParentType extends ResolversParentTypes['OffsetPaginatedUsers'] = ResolversParentTypes['OffsetPaginatedUsers']> = {
  items?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  creationTimestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getContentItems?: Resolver<ResolversTypes['CursorPaginatedContentItems'], ParentType, ContextType, RequireFields<QueryGetContentItemsArgs, 'params'>>;
  getImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<QueryGetImageArgs, 'id'>>;
  getImages?: Resolver<ResolversTypes['CursorPaginatedImages'], ParentType, ContextType, RequireFields<QueryGetImagesArgs, 'params'>>;
  getPost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryGetPostArgs, 'id'>>;
  getPosts?: Resolver<ResolversTypes['CursorPaginatedPosts'], ParentType, ContextType, RequireFields<QueryGetPostsArgs, 'params'>>;
  getTag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<QueryGetTagArgs, 'id'>>;
  getTags?: Resolver<ResolversTypes['CursorPaginatedTags'], ParentType, ContextType, RequireFields<QueryGetTagsArgs, never>>;
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserArgs, 'id'>>;
  getUsers?: Resolver<ResolversTypes['CursorPaginatedUsers'], ParentType, ContextType, RequireFields<QueryGetUsersArgs, 'pagination'>>;
  searchTags?: Resolver<ResolversTypes['CursorPaginatedTags'], ParentType, ContextType, RequireFields<QuerySearchTagsArgs, 'params'>>;
};

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  creationTimestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recentImages?: Resolver<Array<ResolversTypes['Image']>, ParentType, ContextType>;
  recentPosts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  creationTimestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recentContentItems?: Resolver<Array<ResolversTypes['ContentItem']>, ParentType, ContextType>;
  recentImages?: Resolver<Array<ResolversTypes['Image']>, ParentType, ContextType>;
  recentPosts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  ContentItem?: ContentItemResolvers<ContextType>;
  CursorPaginatedContentItems?: CursorPaginatedContentItemsResolvers<ContextType>;
  CursorPaginatedImages?: CursorPaginatedImagesResolvers<ContextType>;
  CursorPaginatedPosts?: CursorPaginatedPostsResolvers<ContextType>;
  CursorPaginatedTags?: CursorPaginatedTagsResolvers<ContextType>;
  CursorPaginatedUsers?: CursorPaginatedUsersResolvers<ContextType>;
  Cursors?: CursorsResolvers<ContextType>;
  Image?: ImageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  OffsetPaginatedUsers?: OffsetPaginatedUsersResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

