import { generateEnvFile } from '~/lib/config';

export enum EnvVarName {
  DB_USER = 'DB_USER',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_HOST = 'DB_HOST',
  DB_DATABASE = 'DB_DATABASE',
  APQ_CACHE_URL = 'APQ_CACHE_URL',
  PORT = 'PORT',
}

export type EnvVars = Record<EnvVarName, string>;

export function generateLocalEnvVars(filepath: string) {
  return generateEnvFile(filepath, {
    [EnvVarName.DB_HOST]: '127.0.0.1',
    [EnvVarName.DB_USER]: 'appuser',
    [EnvVarName.DB_PASSWORD]: 'apppassword',
    [EnvVarName.DB_DATABASE]: 'example_app',
    [EnvVarName.APQ_CACHE_URL]: 'redis://localhost:6379',
  });
}
