import Dataloader from 'dataloader';

import { ImagesRepository, Image } from '../repositories';

export interface ImagesLoader {
  getImagesByOwnerIds: Dataloader<string, Image[]>;
}

export function makeImagesLoader(imagesRepository: ImagesRepository): ImagesLoader {
  const getImagesByOwnerIds = async (ownerIds: ReadonlyArray<string>) => {
    const images = await imagesRepository.getRecentImagesByOwnerIds({
      ownerIds: ownerIds as string[]
    });

    const lookup: Record<string, Image[]> = {};
    for (const ownerId of ownerIds) {
      lookup[ownerId] = [];
    }
    for (const image of images) {
      lookup[image.ownerId].push(image);
    }

    return ownerIds.map(ownerId => lookup[ownerId]);
  };

  return {
    getImagesByOwnerIds: new Dataloader(getImagesByOwnerIds)
  };
}
