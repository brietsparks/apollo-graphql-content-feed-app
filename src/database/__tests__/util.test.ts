import { table } from '../util';

function t() {
  return table('my_table', {
    id: 'id',
    creationTimestamp: 'creation_timestamp'
  });
}

describe('table', () => {
  test('name', () => {
    expect(t().name).toEqual('my_table');
  });

  test('columns', () => {
    expect(t().columns).toEqual({
      id: 'id',
      creationTimestamp: 'creation_timestamp'
    });
  });

  test('writeColumns', () => {
    expect(t().writeColumns({
      id: 'mock-id',
      creationTimestamp: 'mock-timestamp'
    })).toEqual({
      id: 'mock-id',
      creation_timestampz: 'mock-timestamp'
    });
  });

  describe('prefixedColumns', () => {
    test('all', () => {
      expect(t().prefixedColumns.all).toEqual({
        'my_table.id': 'my_table.id',
        'my_table.creation_timestamp': 'my_table.creation_timestamp'
      });
    });

    test('get', () => {
      expect(t().prefixedColumns.get('creationTimestamp')).toEqual('my_table.creation_timestamp');
    });

    test('unmarshal', () => {
      expect(t().prefixedColumns.unmarshal({
        'my_table.id': 'mock-id',
        'my_table.creation_timestamp': 'mock-timestamp'
      })).toEqual({
        id: 'mock-id',
        creationTimestamp: 'mock-timestamp'
      });
    });
  });
});
