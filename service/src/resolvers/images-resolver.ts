import { IFieldResolver } from '@graphql-tools/utils';

import { Repositories, Image } from '../repositories';
import * as schema from '../graphql';

import { adaptCursorPagination } from './adapters';
import { RequestContext } from './context';

export function makeImagesResolver(repositories: Repositories) {
  const createImage: IFieldResolver<unknown, RequestContext, schema.MutationCreateImageArgs> = async (_, { params }) => {
    const creation = await repositories.imagesRepository.createImage(params, { commit: true });
    return repositories.imagesRepository.getImage(creation.id);
  }

  const getImage: IFieldResolver<unknown, RequestContext, schema.QueryGetImageArgs> = (_, { id }) => {
    return repositories.imagesRepository.getImage(id);
  };

  const getImages: IFieldResolver<unknown, RequestContext, schema.QueryGetImagesArgs> = (_, { params }) => {
    return repositories.imagesRepository.getImages({
      pagination: adaptCursorPagination<Image>(params.pagination),
      ownerId: params.ownerId
    });
  }

  const getImageOwner: IFieldResolver<Image, RequestContext> = (image, _, ctx) => {
    return ctx.loaders.usersLoader.getUsersByIds.load(image.ownerId);
  };

  return {
    Query: {
      getImage,
      getImages,
    },
    Mutation: {
      createImage
    },
    Image: {
      id: (p) => p.id,
      creationTimestamp: (p) => p.creationTimestamp,
      ownerId: (p) => p.ownerId,
      owner: getImageOwner,
      url: (p) => p.url,
      caption: (p) => p.caption
    }
  }
}
