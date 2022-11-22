import { createApp } from './app';

void main();

export async function main() {
  const action = process.argv[2];

  const app = await createApp({
    db: {
      user: 'appuser',
      password: 'apppassword',
      host: '127.0.0.1',
      database: 'example_app',
      port: 5432
    },
    apqCacheUrl: 'redis://localhost:6379'
  });

  const vars = {
    port: 3000
  };

  if (!action || action === 'serve') {
    app.server.start().then(s => {
      s.listen(vars.port, () => {
        console.log(`listening on port ${vars.port}`)
      });
    });
  }

  if (action === 'db:up') {
    app.db.migrate.up().then(process.exit);
  }

  if (action === 'db:down') {
    app.db.migrate.down().then(process.exit);
  }
}
