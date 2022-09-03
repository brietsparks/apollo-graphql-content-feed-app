import Dataloader from 'dataloader';

import { PostsRepository, Post } from '../repositories';

export interface PostsLoader {
  getPostsByOwnerIds: Dataloader<string, Post[]>;
}

export function makePostsLoader(postsRepository: PostsRepository): PostsLoader {
  const getPostsByOwnerIds = async (ownerIds: ReadonlyArray<string>) => {
    const posts = await postsRepository.getRecentPostsByOwnerIds({
      ownerIds: ownerIds as string[]
    });

    const lookup: Record<string, Post[]> = {};
    for (const ownerId of ownerIds) {
      lookup[ownerId] = [];
    }
    for (const post of posts) {
      lookup[post.ownerId].push(post);
    }

    return ownerIds.map(ownerId => lookup[ownerId]);
  };

  return {
    getPostsByOwnerIds: new Dataloader(getPostsByOwnerIds)
  };
}
