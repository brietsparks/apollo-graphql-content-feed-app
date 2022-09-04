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

      const c1 = await app.repositories.postsRepository.createPost({ ownerId: userCreation.id, title: faker.random.alphaNumeric() }, { commit: true });
      const c2 = await app.repositories.imagesRepository.createImage({ ownerId: userCreation.id, url: faker.random.alphaNumeric() }, { commit: true });
      const c3 = await app.repositories.postsRepository.createPost({ ownerId: userCreation.id, title: faker.random.alphaNumeric() }, { commit: true });
      const c4 = await app.repositories.imagesRepository.createImage({ ownerId: userCreation.id, url: faker.random.alphaNumeric() }, { commit: true });
      const c5 = await app.repositories.postsRepository.createPost({ ownerId: userCreation.id, title: faker.random.alphaNumeric() }, { commit: true });

      const result = await app.repositories.contentItemsRepository.getContentItems({
        pagination: {
          limit: 3
        },
        ownerId: userCreation.id
      });

      console.log({ result });
    });
  });
});
