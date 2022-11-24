import { requireVar } from '~/lib/config';

import { EnvVarName } from '../config';
import { makeKnexClient } from '../database';

void db();

async function db() {
  const client = await makeKnexClient({
    connection: {
      host: requireVar(EnvVarName.DB_HOST),
      user: requireVar(EnvVarName.DB_USER),
      password: requireVar(EnvVarName.DB_PASSWORD),
      database: requireVar(EnvVarName.DB_DATABASE),
    }
  });

  const action = process.argv[2];
  switch (action) {
    case 'up':
      await client.migrate.up();
      break;
    case 'down':
      await client.migrate.down();
      break;
    case 'latest':
      await client.migrate.latest();
      break;
    default:
      console.log(`unknown action "${action}"`);
      process.exit(1);
  }

  process.exit(0)
}
