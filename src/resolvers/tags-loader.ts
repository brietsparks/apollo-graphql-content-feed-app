import Dataloader from 'dataloader';

import { TagsRepository, Tag } from '../repositories';

export interface TagsLoader {
  getTagsOfPosts: Dataloader<string, Tag[]>;
}

export function makeTagsLoader(tagsRepository: TagsRepository): TagsLoader {
  const getTagsOfPosts = async (postIds: ReadonlyArray<string>) => {
    const tags = await tagsRepository.getTagsOfPosts(postIds as string[]);

    const lookup: Record<string, Tag[]> = {};
    for (const ownerId of postIds) {
      lookup[ownerId] = [];
    }
    for (const tag of tags) {
      lookup[tag.postId].push(tag);
    }

    return postIds.map(ownerId => lookup[ownerId]);
  };

  return {
    getTagsOfPosts: new Dataloader(getTagsOfPosts)
  };
}
