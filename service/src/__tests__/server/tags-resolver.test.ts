import { faker } from '@faker-js/faker';

import { getTestApp, TestApp } from '../test-setup';

import { createTag, getTag } from './operations';

describe('tags resolver', () => {
  let app: TestApp;

  beforeAll(async () => {
    app = await getTestApp();
  });

  afterAll(async () => {
    await app.stop();
  });

  test('createTag', async () => {
    const params = {
      name: faker.name.firstName()
    };

    const result = await app.server.apolloServer.executeOperation({
      query: createTag,
      variables: { params }
    });

    expect(result.data.createTag).toEqual({
      id: expect.any(String),
      creationTimestamp: expect.any(String),
      name: params.name
    });
  });

  test('getTag', async () => {
    const creation = await app.server.apolloServer.executeOperation({
      query: createTag,
      variables: {
        params: {
          name: faker.name.firstName()
        }
      }
    });

    const retrieval = await app.server.apolloServer.executeOperation({
      query: getTag,
      variables: { id: creation.data.createTag.id }
    });

    expect(retrieval.data.getTag).toEqual(creation.data.createTag);
  });
});
