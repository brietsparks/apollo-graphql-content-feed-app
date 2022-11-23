import { StartedTestContainer } from 'testcontainers';
import { knex, Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { createPgTestcontainer } from '~/lib/testcontainers';

import { TransactionsHelper } from '../transactions';

describe('TransactionsHelper', () => {
  let testcontainer: StartedTestContainer;
  let db: Knex;

  beforeAll(async () => {
    const result = await createPgTestcontainer();
    testcontainer = result.testcontainer;
    db = knex({
      client: 'pg',
      connection: result.params
    });

    await db.raw(`
      create table lists
      (
        id uuid primary key
      );

      create table items
      (
        id      uuid primary key,
        list_id uuid references lists (id)
      );
    `);
  });

  afterAll(async () => {
    await testcontainer.stop();
    await db.destroy();
  })

  it('commits a clean transaction', async () => {
    const listTrx = new TransactionsHelper(db);
    const itemTrx = new TransactionsHelper(db);

    const itemId = uuid();
    const listId = uuid();

    const result = await itemTrx.query({ commit: true }, async (t1) => {
      const list = await listTrx.query( { trx: t1, commit: false },  async (t2) => {
        const list = { id: listId };
        await t2.into('lists').insert(list);
        return list;
      });

      const item = {
        id: itemId,
        list_id: list.id
      };
      await t1.into('items').insert(item);

      return item;
    });

    expect(result).toEqual({
      id: itemId,
      list_id: listId
    });

    const retrievedItem = await db
      .from('items')
      .select('*')
      .where({ 'id': itemId })
      .first();

    expect(retrievedItem).toEqual({
      id: itemId,
      list_id: listId
    });

    const retrievedList = await db
      .from('lists')
      .select('*')
      .where({ 'id': listId })
      .first();

    expect(retrievedList).toEqual({
      id: listId
    });
  });

  it('rolls back a failed transaction', async () => {
    const listTrx = new TransactionsHelper(db);
    const itemTrx = new TransactionsHelper(db);

    const itemId = uuid();
    const error = new Error();

    const promise = itemTrx.query({ commit: true }, async (t1) => {
      await listTrx.query( { trx: t1, commit: false },  async () => {
        throw error;
      });

      const item = {
        id: itemId,
      };
      await t1.into('items').insert(item);

      return item;
    });

    await expect(promise).rejects.toThrowError(error);

    const retrievedItem = await db
      .from('items')
      .select('*')
      .where({ 'id': itemId })
      .first();

    expect(retrievedItem).toBeUndefined();
  });
});
