import Dataloader from 'dataloader';

import { ProjectsRepository, Project } from '../repositories';

export interface ProjectsLoader {
  getProjectsByIds: Dataloader<string, Project>;
}

export function makeProjectsLoader(projectsRepository: ProjectsRepository): ProjectsLoader {
  const getProjectsByIds = async (ids: ReadonlyArray<string>) => {
    const projects = await projectsRepository.getProjectsByIds({
      ids: ids as string[]
    });

    const lookup: Record<string, Project> = {};
    for (const project of projects) {
      lookup[project.id] = project;
    }

    return ids.map(id => lookup[id]);
  };

  return {
    getProjectsByIds: new Dataloader(getProjectsByIds)
  };
}
