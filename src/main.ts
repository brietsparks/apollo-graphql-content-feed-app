import { createApp } from './app';

const action = process.argv[2];

const app = createApp();

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
