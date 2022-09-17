import { Table } from '../table-util';

test('Table', () => {
  const postsTable = new Table('posts', {
    id: 'id',
    creationTimestamp: 'creation_timestamp',
  });

  expect(postsTable.name).toEqual('posts');
  expect(postsTable.prefixedColumn('id')).toEqual('posts.id');
  expect(postsTable.prefixedColumn('creationTimestamp')).toEqual('posts.creation_timestamp');
  expect(postsTable.prefixedColumns('id')).toEqual(['posts.id']);
  expect(postsTable.prefixedColumns('creationTimestamp')).toEqual(['posts.creation_timestamp']);
  expect(postsTable.prefixedColumns('id', 'creationTimestamp')).toEqual(['posts.id', 'posts.creation_timestamp']);
  expect(postsTable.prefixedColumns()).toEqual(['posts.id', 'posts.creation_timestamp']);

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
