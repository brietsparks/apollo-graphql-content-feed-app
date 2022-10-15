import { faker } from '@faker-js/faker';

import { getTestApp, TestApp } from '../test-setup';
import { CursorPaginationResult } from '../../repositories/lib/pagination';
import { Post, CreatePostParams } from '../../repositories';

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
    ]);

    let posts: CursorPaginationResult<Post>;

    posts = await app.repositories.postsRepository.getPosts({});
    expect(posts.items).toEqual([post6, post5, post4, post3]);

    posts = await app.repositories.postsRepository.getPosts({
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

  test('getRecentPostsOfTags', async () => {
    const u = await app.repositories.usersRepository.createUser({
      name: faker.name.firstName()
    }, { commit: true });

    const makeCreationParams = (params: Partial<CreatePostParams> = {}): CreatePostParams => ({
      ownerId: u.id,
      title: faker.lorem.slug(5),
      body: faker.lorem.paragraph(3),
      tagIds: params.tagIds || []
    });

    const [t1, t2, t3] = await Promise.all([
      app.repositories.tagsRepository.createTag({ name: 't1' }, { commit: true }),
      app.repositories.tagsRepository.createTag({ name: 't2' }, { commit: true }),
      app.repositories.tagsRepository.createTag({ name: 't3' }, { commit: true }),
    ]);

    const p1 = await app.repositories.postsRepository.createPost(
      makeCreationParams({ tagIds: [t1.id] }), { commit: true }
    );
    const p2 = await app.repositories.postsRepository.createPost(
      makeCreationParams({ tagIds: [t1.id] }), { commit: true }
    );
    const p3 = await app.repositories.postsRepository.createPost(
      makeCreationParams({ tagIds: [t2.id] }), { commit: true }
    );
    await app.repositories.postsRepository.createPost(
      makeCreationParams({ tagIds: [t3.id] }), { commit: true }
    );
    const p5 = await app.repositories.postsRepository.createPost(
      makeCreationParams({ tagIds: [t1.id, t2.id] }), { commit: true }
    );
    await app.repositories.postsRepository.createPost(
      makeCreationParams(), { commit: true }
    );

    const [post1, post2, post3, post5] = await Promise.all([
      app.repositories.postsRepository.getPost(p1.id),
      app.repositories.postsRepository.getPost(p2.id),
      app.repositories.postsRepository.getPost(p3.id),
      app.repositories.postsRepository.getPost(p5.id),
    ]);

    const result = await app.repositories.postsRepository.getRecentPostsOfTags({
      tagIds: [t1.id, t2.id]
    });

    expect(result).toEqual({
      [t1.id]: [
        post5, post2, post1
      ],
      [t2.id]: [
        post5, post3
      ]
    });
  });
});
