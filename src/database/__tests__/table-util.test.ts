import { Table } from '../table-util';

test('Table', () => {
  const postsTable = new Table('posts', {
    id: 'id',
    creationTimestamp: 'creation_timestamp',
  });

  expect(postsTable.name).toEqual('posts');
  expect(postsTable.column('id')).toEqual('posts.id');
  expect(postsTable.column('creationTimestamp')).toEqual('posts.creation_timestamp');
  expect(postsTable.columns('id')).toEqual(['posts.id']);
  expect(postsTable.columns('creationTimestamp')).toEqual(['posts.creation_timestamp']);
  expect(postsTable.columns('id', 'creationTimestamp')).toEqual(['posts.id', 'posts.creation_timestamp']);
  expect(postsTable.columns()).toEqual(['posts.id', 'posts.creation_timestamp']);

  const attributeCasedRow = {
    id: 'a',
    creationTimestamp: new Date()
  };

  const columnCasedRow = {
    'posts.id': attributeCasedRow.id,
    'posts.creation_timestamp': attributeCasedRow.creationTimestamp
  }

  expect(postsTable.toColumnCase(attributeCasedRow)).toEqual(columnCasedRow);
  expect(postsTable.toAttributeCase(columnCasedRow)).toEqual(attributeCasedRow);
});
