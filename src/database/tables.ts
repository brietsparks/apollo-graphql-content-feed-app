import { table } from './util';

export const usersTable = table('users', {
  id: 'id',
  name: 'name',
  creationTimestamp: 'creation_timestamp'
});

export const projectsTable = table('projects', {
  id: 'id',
  name: 'name',
  creationTimestamp: 'creation_timestamp'
});

export const statusesTable = table('statuses', {
  id: 'id',
  projectId: 'project_id',
  name: 'name',
  creationTimestamp: 'creation_timestamp'
});

export const issuesTable = table('issues', {
  id: 'id',
  creationTimestamp: 'creation_timestamp',
  assigneeId: 'assignee_id',
  statusId: 'status_id',
  name: 'name',
  description: 'description',
});
