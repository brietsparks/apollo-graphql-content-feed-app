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

  test('getUsers', async () => {
    const u1 = await app.repositories.usersRepository.createUser({ name: faker.name.firstName() },{ commit: true });
    const u2 = await app.repositories.usersRepository.createUser({ name: faker.name.firstName() },{ commit: true });
    const u3 = await app.repositories.usersRepository.createUser({ name: faker.name.firstName() },{ commit: true });
    const u4 = await app.repositories.usersRepository.createUser({ name: faker.name.firstName() },{ commit: true });
    const u5 = await app.repositories.usersRepository.createUser({ name: faker.name.firstName() },{ commit: true });

    const [user1, user2, user3, user4, user5] = await Promise.all([
      app.repositories.usersRepository.getUser(u1.id),
      app.repositories.usersRepository.getUser(u2.id),
      app.repositories.usersRepository.getUser(u3.id),
      app.repositories.usersRepository.getUser(u4.id),
      app.repositories.usersRepository.getUser(u5.id),
    ]);

    const retrieval = await app.repositories.usersRepository.getUsers({
      pagination: {
        cursor: user4.creationTimestamp,
        limit: 3
      }
    });

    expect(retrieval.cursors).toEqual({
      start: user4.creationTimestamp,
      end: user2.creationTimestamp,
      next: user1.creationTimestamp,
    });
  });
});
