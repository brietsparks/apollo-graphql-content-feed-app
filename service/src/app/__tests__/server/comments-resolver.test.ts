import { faker } from '@faker-js/faker';

import { getTestApp, TestApp } from '../test-setup';

import { createUser, createPost, createPostComment } from './operations';

describe('comments resolver', () => {
  let app: TestApp;

  beforeAll(async () => {
    app = await getTestApp();
  });

  afterAll(async () => {
    await app.stop();
  });

  test('createPostComment', async () => {
    const userCreation = await app.server.apolloServer.executeOperation({
      query: createUser,
      variables: {
        params: {
          name: faker.name.firstName()
        }
      }
    });
    const { id: userId } = userCreation.data.createUser;

    const postCreation = await app.server.apolloServer.executeOperation({
      query: createPost,
      variables: {
        params: {
          ownerId: userId,
          title: faker.random.alpha()
        }
      }
    });
    const { id: postId } = postCreation.data.createPost;

    const body = faker.random.alpha();

    const commentCreation = await app.server.apolloServer.executeOperation({
      query: createPostComment,
      variables: {
        params: {
          ownerId: userId,
          postId,
          body,
        }
      }
    });

    expect(commentCreation.data.createPostComment).toEqual({
      id: expect.any(String),
      creationTimestamp: expect.any(String),
      ownerId: userId,
      body,
    });
  });
});
