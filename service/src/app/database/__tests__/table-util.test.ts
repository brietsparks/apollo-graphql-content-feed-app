import { Table } from '../table-util';

test('Table', () => {
  const postsTable = new Table('posts', {
    id: 'id',
    creationTimestamp: 'creation_timestamp',
  });

  expect(postsTable.name).toEqual('posts');
  expect(postsTable.prefixedColumn('id')).toEqual('posts.id');
  expect(postsTable.prefixedColumn('creationTimestamp')).toEqual('posts.creation_timestamp');
  expect(postsTable.prefixedColumns('id')).toEqual({ 'posts.id': 'posts.id' });
  expect(postsTable.prefixedColumns('creationTimestamp')).toEqual({ 'posts.creation_timestamp': 'posts.creation_timestamp' });
  expect(postsTable.prefixedColumns('id', 'creationTimestamp')).toEqual({
    'posts.id': 'posts.id',
    'posts.creation_timestamp': 'posts.creation_timestamp'
  });
  expect(postsTable.prefixedColumns()).toEqual({
    'posts.id': 'posts.id',
    'posts.creation_timestamp': 'posts.creation_timestamp'
  });

  const attributeCasedRow = {
    id: 'a',
    creationTimestamp: new Date()
  };

  expect(postsTable.toColumnCase(attributeCasedRow)).toEqual({
    'id': attributeCasedRow.id,
    'creation_timestamp': attributeCasedRow.creationTimestamp
  });

  expect(postsTable.toAttributeCase({
    'posts.id': attributeCasedRow.id,
    'posts.creation_timestamp': attributeCasedRow.creationTimestamp
  })).toEqual(attributeCasedRow);
});
