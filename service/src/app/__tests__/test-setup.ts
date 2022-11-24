import { createPgTestcontainer } from '~/lib/testcontainers';

import { createApp, Nexus } from '../nexus';

export interface TestApp extends Nexus {
  stop: () => void;
}

let testApp: TestApp;

export async function getTestApp() {
  if (testApp) {
    return testApp;
  }

  const { testcontainer: pgTestcontainer, params: pgParams } = await createPgTestcontainer();

  const app = await createApp({ db: pgParams });

  await app.db.migrate.latest();

  const stop = async () => {
    await pgTestcontainer.stop();
    await app.db.destroy();
  }

  testApp = {
    ...app,
    stop
  };

  return testApp;
}
