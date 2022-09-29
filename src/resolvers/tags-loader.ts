import Dataloader from 'dataloader';

import { TagsRepository, Tag } from '../repositories';

export interface TagsLoader {
  getTagsOfPosts: Dataloader<string, Tag[]>;
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

  return {
    getTagsOfPosts: new Dataloader(getTagsOfPosts)
  };
}
