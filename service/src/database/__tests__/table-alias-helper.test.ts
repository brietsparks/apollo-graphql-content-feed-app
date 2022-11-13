import { TableAliasHelper } from '../table-alias-helper';

const table = new TableAliasHelper('my_table', {
  col: 'col',
  myColumn: 'my_column',
});

describe('TableAliasHelper', () => {
  describe('select', () => {
    test('wildcard', () => {
      expect(table.select('*')).toEqual({
        'my_table:col': 'my_table.col',
        'my_table:myColumn': 'my_table.my_column',
      });
    });

    test('specified columns', () => {
      expect(table.select( 'myColumn')).toEqual({
        'my_table:myColumn': 'my_table.my_column',
      });

      expect(table.select( 'col', 'myColumn')).toEqual({
        'my_table:col': 'my_table.col',
        'my_table:myColumn': 'my_table.my_column',
      });
    });
  });

  test('predicate', () => {
    expect(table.predicate('myColumn')).toEqual('my_table.my_column');
  });

  test('toAlias', () => {
    const row = table.toAlias({
      'my_table:col': 'foo',
      'my_table:myColumn': 'bar',
    });

    expect(row).toEqual({
      'col': 'foo',
      'myColumn': 'bar',
    });
  });

  describe('wrap', () => {
    test('test', () => {
      expect(table.wrap().select('*')).toEqual({
        'my_table::col': 'my_table:col',
        'my_table::myColumn': 'my_table:myColumn',
      });
    });

    test('toAlias', () => {

    });
  });
});
