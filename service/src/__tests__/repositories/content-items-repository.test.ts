import { faker } from '@faker-js/faker';

import { getTestApp, TestApp } from '../test-setup';

describe('ContentItemsRepository', () => {
  let app: TestApp;

  beforeAll(async () => {
    app = await getTestApp();
  });

  afterAll(async () => {
    await app.stop();
  });

  describe('getContentItems', () => {
    test('no ownerId', async () => {
      const userCreation = await app.repositories.usersRepository.createUser({ name: faker.name.firstName() },{ commit: true });

      const c1 = await app.repositories.postsRepository.createPost({
        ownerId: userCreation.id,
        title: `c1.${faker.random.alphaNumeric()}`
      }, { commit: true });
      const c2 = await app.repositories.imagesRepository.createImage({
        ownerId: userCreation.id,
        url: `c2.${faker.random.alphaNumeric()}`
      }, { commit: true });
      const c3 = await app.repositories.postsRepository.createPost({
        ownerId: userCreation.id,
        title: `c3.${faker.random.alphaNumeric()}`
      }, { commit: true });
      const c4 = await app.repositories.imagesRepository.createImage({
        ownerId: userCreation.id,
        url: `c4.${faker.random.alphaNumeric()}`
      }, { commit: true });
      await app.repositories.postsRepository.createPost({
        ownerId: userCreation.id,
        title: `c5.${faker.random.alphaNumeric()}`
      }, { commit: true });

      const [content1, content2, content3, content4] = await Promise.all([
        app.repositories.postsRepository.getPost(c1.id),
        app.repositories.imagesRepository.getImage(c2.id),
        app.repositories.postsRepository.getPost(c3.id),
        app.repositories.imagesRepository.getImage(c4.id),
      ])

      const result = await app.repositories.contentItemsRepository.getContentItems({
        pagination: { limit: 3, cursor: content4.creationTimestamp },
        ownerId: userCreation.id
      });

      expect(result).toEqual({
        items: [
          { ...content4, _type: 'image' },
          { ...content3, _type: 'post' },
          { ...content2, _type: 'image' },
        ],
        cursors: {
          start: content4.creationTimestamp,
          end: content2.creationTimestamp,
          next: content1.creationTimestamp
        }
      });
    });
  });
});
