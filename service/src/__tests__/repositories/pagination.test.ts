import { StartedTestContainer } from 'testcontainers';
import { Knex } from 'knex';

import { createPgTestcontainer, makeKnexClient } from '../../database';

import { makeCursorPagination } from '../../repositories/lib/pagination';

describe('makePagination', () => {
  let testcontainer: StartedTestContainer;
  let db: Knex;

  beforeAll(async () => {
    const result = await createPgTestcontainer();
    testcontainer = result.testcontainer;
    db = await makeKnexClient({
      connection: result.params
    });

    await db.raw(`
      create table items (
        id int primary key
      );

      insert into items(id) values (1);
      insert into items(id) values (2);
      insert into items(id) values (3);
      insert into items(id) values (4);
      insert into items(id) values (5);
      insert into items(id) values (6);
      insert into items(id) values (7);
    `);
  });

  afterAll(async () => {
    await testcontainer.stop();
    await db.destroy();
  });

  it('returns paginated items', async () => {
    const pagination = makeCursorPagination<any>({
      limit: 3,
      sortDirection: 'desc',
      field: 'id',
    });

    const result = await db
      .from('items')
      .select('*')
      .where(...pagination.where)
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit);

    console.log(result);
    // console.log(pagination.getPaginatedItems(result));
  });
});
