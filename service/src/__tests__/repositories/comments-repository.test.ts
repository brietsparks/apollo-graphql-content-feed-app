import { faker } from '@faker-js/faker';

import { getTestApp, TestApp } from '../test-setup';

describe('CommentsRepository', () => {
  let app: TestApp;

  beforeAll(async () => {
    app = await getTestApp();
  });

  afterAll(async () => {
    await app.stop();
  });

  async function createPost() {
    const { id: userId } = await app.repositories.usersRepository.createUser({
      name: faker.name.firstName(),
    }, { commit: true });

    const { id: postId } = await app.repositories.postsRepository.createPost({
      ownerId: userId,
      title: faker.random.alphaNumeric(),
    }, { commit: true });

    return { userId, postId };
  }


  test('createPostComment', async () => {
    const { userId, postId } = await createPost();

    const body = faker.random.alphaNumeric()

    const { id: commentId } = await app.repositories.commentsRepository.createPostComment({
      postId,
      ownerId: userId,
      body
    }, { commit: true });

    const comment = await app.repositories.commentsRepository.getComment(commentId);
    expect(comment).toEqual({
      id: commentId,
      creationTimestamp: expect.any(String),
      ownerId: userId,
      body
    });
  });

  test('getCommentsOfPost', async () => {
    const { id: userId } = await app.repositories.usersRepository.createUser({
      name: faker.name.firstName(),
    }, { commit: true });

    const [{ postId: postId1 }] = await Promise.all([
      createPost(),
      createPost()
    ]);

    const { id: commentId1 } = await app.repositories.commentsRepository.createPostComment({
      postId: postId1,
      ownerId: userId,
      body: faker.random.alphaNumeric()
    }, { commit: true });

    

    await app.repositories.commentsRepository.getCommentsOfPost({
      postId: postId1
    })


  });
});
