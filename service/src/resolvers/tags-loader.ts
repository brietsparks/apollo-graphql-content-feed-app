import Dataloader from 'dataloader';

import { TagsRepository, Tag } from '../repositories';

export interface TagsLoader {
  getTagsOfPosts: Dataloader<string, Tag[]>;
  getTagsOfImages: Dataloader<string, Tag[]>;
}

export function makeTagsLoader(tagsRepository: TagsRepository): TagsLoader {
  const getTagsOfPosts = async (postIds: ReadonlyArray<string>) => {
    const tags = await tagsRepository.getTagsOfPosts(postIds as string[]);

    const lookup: Record<string, Tag[]> = {};
    for (const postId of postIds) {
      lookup[postId] = [];
    }
    for (const tag of tags) {
      lookup[tag.postId].push(tag);
    }

    return postIds.map(postId => lookup[postId]);
  };

  const getTagsOfImages = async (imageIds: ReadonlyArray<string>) => {
    const tags = await tagsRepository.getTagsOfImages(imageIds as string[]);

    const lookup: Record<string, Tag[]> = {};
    for (const imageId of imageIds) {
      lookup[imageId] = [];
    }
    for (const tag of tags) {
      lookup[tag.imageId].push(tag);
    }

    return imageIds.map(imageId => lookup[imageId]);
  };

  return {
    getTagsOfPosts: new Dataloader(getTagsOfPosts),
    getTagsOfImages: new Dataloader(getTagsOfImages),
  };
}
