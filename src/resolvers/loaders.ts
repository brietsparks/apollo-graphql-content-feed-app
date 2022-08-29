import { Repositories } from '../repositories';

import { makeProjectsLoader } from './projects-loader';
import { makeStatusesLoader } from './statuses-loader';

export type Loaders = ReturnType<typeof makeLoaders>;

export function makeLoaders(repositories: Repositories) {
  const projectsLoader = makeProjectsLoader(repositories.projectsRepository);
  const statusesLoader = makeStatusesLoader(repositories.statusesRepository);
  return {
    projectsLoader,
    statusesLoader,
  };
}
