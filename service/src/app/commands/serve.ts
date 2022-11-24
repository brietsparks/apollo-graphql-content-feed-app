import { requireVar, getVar } from '~/lib/config';

import { EnvVarName } from '../config';
import { makeKnexClient } from '../database';
import { makeRepositories } from '../repositories';
import { makeServer } from '../server';

void serve();

async function serve() {
  const db = await makeKnexClient({
    connection: {
      host: requireVar(EnvVarName.DB_HOST),
      user: requireVar(EnvVarName.DB_USER),
      password: requireVar(EnvVarName.DB_PASSWORD),
      database: requireVar(EnvVarName.DB_DATABASE),
    }
  });

  const repositories = makeRepositories(db);
  const server = makeServer(repositories, {
    apqCacheUrl: getVar(EnvVarName.APQ_CACHE_URL),
  });

  const port = getVar(EnvVarName.PORT, '3000');
  server.start().then(s => {
    s.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
}
