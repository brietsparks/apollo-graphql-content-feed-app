import { knex, Knex } from 'knex';
/*

    'posts:id': 'posts.id',
    'posts:ownerId': 'posts.owner_id',

  'posts::id': 'post:id',
  'posts::ownerId': 'post:ownerId',

'posts:::id': 'post::id',
'posts:::ownerId': 'post::ownerId',

parse
  posts:id --> id
  posts:ownerId --> ownerId

  posts::id --> id
  posts::ownerId --> ownerId

  posts:::id --> id
  posts:::ownerId --> ownerId
 */

const postsTable = {} as any;

const db = knex({});

const ownerId = '';

const query1Columns = postsTable.alias((col, table) => `${table}:${col}`);
const query2Columns = query1Columns.alias((col, table, prev) => `${table}::${col}`);

db
  .from((subquery: Knex) => {
    return subquery
      .from(postsTable.name)
      .select(query1Columns.select())
      .where({
        [query1Columns.where('ownerId')]: ownerId
      })
      .as('subquery')
  })
  .select(query2Columns.select())
  .where(query2Columns)
