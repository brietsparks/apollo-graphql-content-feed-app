import { hello } from 'bak/hello';
import { testOrm } from 'bak/ormtest';

test('hello', () => {
  expect(hello('world')).toEqual('Hello world');
});

test('orm', async () => {
  await testOrm();
});
