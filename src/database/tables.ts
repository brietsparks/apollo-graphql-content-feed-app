import { table } from './util';

export const usersTable = table('users', {
  id: 'id',
  name: 'name',
  creationTimestamp: 'creation_timestamp'
});
