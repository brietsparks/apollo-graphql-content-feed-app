import Dataloader from 'dataloader';

import { StatusesRepository, Status } from '../repositories';

export interface StatusesLoader {
  getStatusesOfProjects: Dataloader<string, Status[]>;
}

export function makeStatusesLoader(statusesRepository: StatusesRepository): StatusesLoader {
  const getStatusesOfProjects = async (projectIds: ReadonlyArray<string>) => {
    const statuses = await statusesRepository.getStatusesOfProjects({
      projectIds: projectIds as string[]
    });

    const statusesByProjectId: Record<string, Status[]> = {};
    for (const projectId of projectIds) {
      statusesByProjectId[projectId] = [];
    }
    for (const status of statuses) {
      statusesByProjectId[status.projectId].push(status);
    }

    return projectIds.map(projectId => statusesByProjectId[projectId]);
  };

  return {
    getStatusesOfProjects: new Dataloader(getStatusesOfProjects)
  }
}
