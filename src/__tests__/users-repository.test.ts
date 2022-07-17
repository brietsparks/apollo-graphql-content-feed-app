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

  test('createUser', async () => {
    const params = {
      name: faker.name.firstName()
    };
    const user = await app.repositories.usersRepository.createUser(params);

    expect(user).toEqual({
      id: expect.any(String),
      name: params.name,
      creationTimestamp: expect.any(Date)
    });
  });

  test('getUser', async () => {
    const creation = await app.repositories.usersRepository.createUser({
      name: faker.name.firstName()
    });
    const retrieval = await app.repositories.usersRepository.getUser(creation.id);
    expect(retrieval).toEqual(creation);
  });
});
