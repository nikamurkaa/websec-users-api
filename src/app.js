const express = require('express');
const { createUserStore } = require('./services/users');
const { createUsersRouter } = require('./routes/users');
const { notFoundHandler, errorHandler } = require('./middleware/errors');

function createApp(options = {}) {
  const app = express();
  const userStore = options.userStore || createUserStore();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '10kb' }));

  app.get('/health', (req, res) => {
    return res.json({ status: 'ok', service: 'websec-users-api' });
  });

  app.use('/users', createUsersRouter(userStore));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp
};
