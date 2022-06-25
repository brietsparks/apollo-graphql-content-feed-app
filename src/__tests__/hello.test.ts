import { hello } from '../hello';

test('hello', () => {
  expect(hello('world')).toEqual('Hello world');
});
