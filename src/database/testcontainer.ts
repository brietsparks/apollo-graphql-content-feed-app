import { GenericContainer } from 'testcontainers';

export async function createPgTestcontainer() {
  const params = {
    host: '127.0.0.1',
    user: 'root',
    database: 'root',
    password: 'password',
  };

  const pgContainer = await new GenericContainer('postgres')
    .withExposedPorts(5432)
    .withEnv('POSTGRES_PASSWORD', params.password)
    .withEnv('POSTGRES_USER', params.user)
    .withEnv('POSTGRES_DB', params.database)
    .start();

  return {
    testcontainer: pgContainer,
    params: {
      ...params,
      port: pgContainer.getMappedPort(5432)
    }
  }
}
