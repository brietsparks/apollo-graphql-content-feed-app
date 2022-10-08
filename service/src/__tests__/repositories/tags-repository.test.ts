import { getTestApp, TestApp } from '../test-setup';

describe('TagsRepository', () => {
  let app: TestApp;

  beforeAll(async () => {
    app = await getTestApp();
  });

  afterAll(async () => {
    await app.stop();
  });

  test('getTagsOfPosts', async () => {
    const [u, t1, t2, t3] = await Promise.all([
      app.repositories.usersRepository.createUser({ name: 'u' }, { commit: true }),
      app.repositories.tagsRepository.createTag({ name: 't1' }, { commit: true }),
      app.repositories.tagsRepository.createTag({ name: 't2' }, { commit: true }),
      app.repositories.tagsRepository.createTag({ name: 't3' }, { commit: true }),
      app.repositories.tagsRepository.createTag({ name: 't4' }, { commit: true }),
    ]);

    const [p1, p2, p3] = await Promise.all([
      app.repositories.postsRepository.createPost({
        ownerId: u.id,
        title: 'p1',
        tagIds: [t1.id]
      }, { commit: true }),
      app.repositories.postsRepository.createPost({
        ownerId: u.id,
        title: 'p2',
        tagIds: [t2.id]
      }, { commit: true }),
      app.repositories.postsRepository.createPost({
        ownerId: u.id,
        title: 'p3',
        tagIds: [t1.id, t3.id]
      }, { commit: true }),
    ]);

    const [tag1, tag2, tag3] = await Promise.all([
      app.repositories.tagsRepository.getTag(t1.id),
      app.repositories.tagsRepository.getTag(t2.id),
      app.repositories.tagsRepository.getTag(t3.id),
    ]);

    const result = await app.repositories.tagsRepository.getTagsOfPosts([p1.id, p2.id, p3.id]);

    expect(result).toEqual(expect.arrayContaining([
      { ...tag1, postId: p1.id },
      { ...tag2, postId: p2.id },
      { ...tag3, postId: p3.id },
      { ...tag1, postId: p3.id },
    ]));
    expect(result.length).toEqual(4);
  });

  test('search tags', async () => {
    const [t1, t2] = await Promise.all([
      app.repositories.tagsRepository.createTag({ name: 'foo' }, { commit: true }),
      app.repositories.tagsRepository.createTag({ name: 'foo1' }, { commit: true }),
      app.repositories.tagsRepository.createTag({ name: 'bar' }, { commit: true }),
      app.repositories.tagsRepository.createTag({ name: 'baz' }, { commit: true }),
    ]);

    const result = await app.repositories.tagsRepository.searchTags({
      pagination: {},
      term: 'foo'
    });

    const [tag1, tag2] = await Promise.all([
      app.repositories.tagsRepository.getTag(t1.id),
      app.repositories.tagsRepository.getTag(t2.id),
    ]);

    expect(result.items).toEqual([tag1, tag2]);
  });
});
