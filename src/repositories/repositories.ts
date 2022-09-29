import { Knex } from 'knex';
import pg from 'pg';

import { UsersRepository } from './users-repository';
import { TagsRepository } from './tags-repository';
import { PostsRepository } from './posts-repository';
import { ImagesRepository } from './images-repository';
import { ContentItemsRepository } from './content-items-repository';

export * from './users-repository';
export * from './tags-repository';
export * from './posts-repository';
export * from './images-repository';
export * from './content-items-repository';

export type Repositories = ReturnType<typeof makeRepositories>;

export function makeRepositories(db: Knex) {
  configurePgParsers();

  const usersRepository = new UsersRepository(db);
  const tagsRepository = new TagsRepository(db);
  const postsRepository = new PostsRepository(db);
  const imagesRepository = new ImagesRepository(db);
  const contentItemsRepository = new ContentItemsRepository(db);

  return {
    usersRepository,
    tagsRepository,
    postsRepository,
    imagesRepository,
    contentItemsRepository,
  };
}

function configurePgParsers() {
  pg.types.setTypeParser(20, 'text', parseInt)

  // fixes precision mismatch between pg and js
  // returns postgres dates as ISO 8601 string, e.g. "2022-08-21 05:10:22.892975+00"
  // https://github.com/brianc/node-postgres/issues/1200#issuecomment-281478610
  pg.types.setTypeParser(1082, pgToString); // date
  pg.types.setTypeParser(1083, pgToString); // time
  pg.types.setTypeParser(1114, pgToString); // timestamp
  pg.types.setTypeParser(1184, pgToString); // timestamptz
  pg.types.setTypeParser(1266, pgToString); // timetz
}

function pgToString(value) {
  return value.toString();
}
