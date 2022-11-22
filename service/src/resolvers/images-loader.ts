import Dataloader from 'dataloader';

import { ImagesRepository, Image } from '../repositories';

export interface ImagesLoader {
  getImagesByOwnerIds: Dataloader<string, Image[]>;
  getRecentImagesOfTags: Dataloader<string, Image[]>;
}

export function makeImagesLoader(imagesRepository: ImagesRepository): ImagesLoader {
  const getImagesByOwnerIds = async (ownerIds: ReadonlyArray<string>) => {
    const imagesByOwnerIds = await imagesRepository.getRecentImagesByOwnerIds({
      ownerIds: ownerIds as string[]
    });
    return ownerIds.map(ownerId => imagesByOwnerIds[ownerId] || []);
  };

  const getRecentImagesOfTags = async (tagIds: string[]) => {
    const imagesOfTags = await imagesRepository.getRecentImagesOfTags({ tagIds });
    return tagIds.map(tagId => imagesOfTags[tagId] || []);
  };

  return {
    getImagesByOwnerIds: new Dataloader(getImagesByOwnerIds),
    getRecentImagesOfTags: new Dataloader(getRecentImagesOfTags),
  };
}
