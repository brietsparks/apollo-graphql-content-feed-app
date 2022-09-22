import { faker } from '@faker-js/faker';

import { getTestApp, TestApp } from '../test-setup';

import { createUser, getUser } from './operations';

describe('users resolver', () => {
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

    const result = await app.server.apolloServer.executeOperation({
      query: createUser,
      variables: { params }
    });

    expect(result.data.createUser).toEqual({
      id: expect.any(String),
      creationTimestamp: expect.any(String),
      name: params.name
    });
  });

  test('getUser', async () => {
    const creation = await app.server.apolloServer.executeOperation({
      query: createUser,
      variables: {
        params: {
          name: faker.name.firstName()
        }
      }
    });

    const retrieval = await app.server.apolloServer.executeOperation({
      query: getUser,
      variables: { id: creation.data.createUser.id }
    });

    expect(retrieval.data.getUser).toEqual(creation.data.createUser);
  });
});
