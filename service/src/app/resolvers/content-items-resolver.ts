import { IFieldResolver } from '@graphql-tools/utils';

import { Repositories, ContentItem } from '../repositories';
import * as schema from '../graphql';

import { adaptCursorPagination } from './adapters';
import { RequestContext } from './context';

export function makeContentItemsResolver(repositories: Repositories) {
  const getContentItems: IFieldResolver<unknown, RequestContext, schema.QueryGetContentItemsArgs> = (_, { params }) => {
    return repositories.contentItemsRepository.getContentItems({
      pagination: adaptCursorPagination<{ creationTimestamp: string }>(params.pagination),
      ownerId: params.ownerId
    });
  };

  const resolveType: IFieldResolver<ContentItem, RequestContext> = (item) => {
    if (item._type === 'post') {
      return 'Post';
    }
    if (item._type === 'image') {
      return 'Image';
    }
    return null;
  };

  return {
    Query: {
      getContentItems
    },
    ContentItem: {
      __resolveType: resolveType
    }
  }
}
