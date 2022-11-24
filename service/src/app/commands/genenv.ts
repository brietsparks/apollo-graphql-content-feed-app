import { generateLocalEnvVars } from '../config';

void genenv();

async function genenv() {
  const mode = process.argv[2];

  if (mode === 'local') {
    await generateLocalEnvVars('./.env');
  }
}
