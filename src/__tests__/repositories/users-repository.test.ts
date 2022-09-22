import { faker } from '@faker-js/faker';

import { getTestApp, TestApp } from '../test-setup';

describe('UsersRepository', () => {
  let app: TestApp;

  beforeAll(async () => {
    app = await getTestApp();
  });

  afterAll(async () => {
    await app.stop();
  });

  test('createUser and getUser', async () => {
    const params = {
      name: faker.name.firstName()
    };
    const creation = await app.repositories.usersRepository.createUser(params,{ commit: true });
    const retrieval = await app.repositories.usersRepository.getUser(creation.id);

    expect(retrieval).toEqual({
      id: expect.any(String),
      name: params.name,
      creationTimestamp: expect.any(String)
    });
  });
});
