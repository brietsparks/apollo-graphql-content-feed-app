import { faker } from '@faker-js/faker';

import { getTestApp, TestApp } from '../test-setup';

describe('PostsRepository', () => {
  let app: TestApp;

  beforeAll(async () => {
    app = await getTestApp();
  });

  afterAll(async () => {
    await app.stop();
  });

  test('getPosts', async () => {
    const u = await app.repositories.usersRepository.createUser({
      name: faker.name.firstName()
    }, { commit: true });

    const makeCreationParams = () => ({
      ownerId: u.id,
      title: faker.lorem.slug(5),
      body: faker.lorem.paragraph(3),
    });

    const p1 = await app.repositories.postsRepository.createPost(makeCreationParams(), { commit: true });
    const p2 = await app.repositories.postsRepository.createPost(makeCreationParams(), { commit: true });
    const p3 = await app.repositories.postsRepository.createPost(makeCreationParams(), { commit: true });
    const p4 = await app.repositories.postsRepository.createPost(makeCreationParams(), { commit: true });
    const p5 = await app.repositories.postsRepository.createPost(makeCreationParams(), { commit: true });
    const p6 = await app.repositories.postsRepository.createPost(makeCreationParams(), { commit: true });

    const [
      post1,
      post2,
      post3,
      post4,
      post5,
      post6,
    ] = await Promise.all([
      app.repositories.postsRepository.getPost(p1.id),
      app.repositories.postsRepository.getPost(p2.id),
      app.repositories.postsRepository.getPost(p3.id),
      app.repositories.postsRepository.getPost(p4.id),
      app.repositories.postsRepository.getPost(p5.id),
      app.repositories.postsRepository.getPost(p6.id),
    ])

    let posts = await app.repositories.postsRepository.getPosts({
      pagination: {
        limit: 3
      }
    });
    expect(posts.items).toEqual([post6, post5, post4]);

    posts = await app.repositories.postsRepository.getPosts({
      pagination: {
        cursor: post4.creationTimestamp,
        limit: 2,
      }
    });
    expect(posts.items).toEqual([post4, post3]);
  });
});
