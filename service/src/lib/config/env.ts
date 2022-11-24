import * as fs from 'fs/promises';
import { config as configureEnv } from 'dotenv';

configureEnv();

export function requireVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`env var ${name} missing`);
  }
  return value;
}

export function getVar(name: string, fallback = '') {
  const value = process.env[name];
  return value || fallback;
}

export async function generateEnvFile(filepath: string, vars: Record<string, string>) {
  let envFileContents = '';
  for (const key of Object.keys(vars)) {
    envFileContents += `${key}=${vars[key]}\n`
  }

  await fs.writeFile(filepath, envFileContents);
}

