const express = require('express');
const { authenticate, requireAdmin, requireAdminOrOwner } = require('../middleware/auth');
const { errorResponse } = require('../middleware/errors');

function createUsersRouter(userStore) {
  const router = express.Router();

  router.use(authenticate(userStore));

  router.get('/me', (req, res) => {
    return res.json(userStore.toPublicUser(req.user));
  });

  router.get('/', requireAdmin, (req, res) => {
    return res.json(userStore.listPublicUsers());
  });

  router.get('/:userId', requireAdminOrOwner, (req, res) => {
    const user = userStore.findByPublicId(req.params.userId);

    if (!user) {
      return errorResponse(res, 404, 'USER_NOT_FOUND', 'User was not found.');
    }

    return res.json(userStore.toPublicUser(user));
  });

  router.patch('/:userId', requireAdminOrOwner, (req, res) => {
    const user = userStore.findByPublicId(req.params.userId);

    if (!user) {
      return errorResponse(res, 404, 'USER_NOT_FOUND', 'User was not found.');
    }

    const validationErrors = userStore.validateUpdates(req.body);
    if (validationErrors.length > 0) {
      return errorResponse(res, 400, 'VALIDATION_ERROR', 'Invalid update payload.', validationErrors);
    }

    return res.json(userStore.updateUser(req.params.userId, req.body));
  });

  return router;
}

module.exports = {
  createUsersRouter
};
