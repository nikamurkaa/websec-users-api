const { createInitialUsers } = require('../data/users');
const { hashPassword } = require('../utils/password');

const allowedUpdateFields = new Set(['displayName', 'email', 'password']);

function createUserStore(initialUsers = createInitialUsers()) {
  const users = initialUsers.map(user => ({ ...user }));

  function toPublicUser(user) {
    return {
      id: user.publicId,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      role: user.role
    };
  }

  function findByToken(token) {
    return users.find(user => user.token === token) || null;
  }

  function findByPublicId(publicId) {
    return users.find(user => user.publicId === publicId) || null;
  }

  function listPublicUsers() {
    return users.map(toPublicUser);
  }

  function validateUpdates(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return ['Request body must be a JSON object.'];
    }

    const fields = Object.keys(payload);
    if (fields.length === 0) {
      return ['At least one field must be provided.'];
    }

    const forbiddenFields = fields.filter(field => !allowedUpdateFields.has(field));
    if (forbiddenFields.length > 0) {
      return [`Only displayName, email and password can be updated. Forbidden fields: ${forbiddenFields.join(', ')}.`];
    }

    const errors = [];

    if ('displayName' in payload) {
      if (typeof payload.displayName !== 'string' || payload.displayName.trim().length < 2) {
        errors.push('displayName must be a string with at least 2 characters.');
      }
    }

    if ('email' in payload) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof payload.email !== 'string' || !emailPattern.test(payload.email)) {
        errors.push('email must be a valid email address.');
      }
    }

    if ('password' in payload) {
      if (typeof payload.password !== 'string' || payload.password.length < 8) {
        errors.push('password must contain at least 8 characters.');
      }
    }

    return errors;
  }

  function updateUser(publicId, payload) {
    const user = findByPublicId(publicId);
    if (!user) {
      return null;
    }

    if ('displayName' in payload) {
      user.displayName = payload.displayName.trim();
    }

    if ('email' in payload) {
      user.email = payload.email.trim().toLowerCase();
    }

    if ('password' in payload) {
      user.passwordHash = hashPassword(payload.password);
    }

    return toPublicUser(user);
  }

  return {
    findByToken,
    findByPublicId,
    listPublicUsers,
    toPublicUser,
    validateUpdates,
    updateUser
  };
}

module.exports = {
  createUserStore
};
