import { Knex } from 'knex';
import pg from 'pg';

import { UsersRepository } from './users-repository';
import { ProjectsRepository } from './projects-repository';
import { StatusesRepository } from './statuses-repository';
import { IssuesRepository } from './issues-repository';

export * from './users-repository';
export * from './projects-repository';
export * from './statuses-repository';
export * from './issues-repository';

export type Repositories = ReturnType<typeof makeRepositories>;

export function makeRepositories(db: Knex) {
  configurePgParsers();

  const usersRepository = new UsersRepository(db);
  const projectsRepository = new ProjectsRepository(db);
  const statusesRepository = new StatusesRepository(db);
  const issuesRepository = new IssuesRepository(db);

  return {
    usersRepository,
    projectsRepository,
    statusesRepository,
    issuesRepository,
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
