const { errorResponse } = require('./errors');

function extractBearerToken(req) {
  const header = req.get('authorization');
  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

function authenticate(userStore) {
  return (req, res, next) => {
    const token = extractBearerToken(req);
    const user = token ? userStore.findByToken(token) : null;

    if (!user) {
      return errorResponse(res, 401, 'UNAUTHORIZED', 'Valid Bearer token is required.');
    }

    req.user = user;
    return next();
  };
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return errorResponse(res, 403, 'FORBIDDEN', 'Admin role is required.');
  }

  return next();
}

function requireAdminOrOwner(req, res, next) {
  const isAdmin = req.user.role === 'admin';
  const isOwner = req.user.publicId === req.params.userId;

  if (!isAdmin && !isOwner) {
    return errorResponse(res, 403, 'FORBIDDEN', 'You can access only your own user profile.');
  }

  return next();
}

module.exports = {
  authenticate,
  requireAdmin,
  requireAdminOrOwner
};
