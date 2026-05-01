const crypto = require('crypto');

const ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString('hex');

  return `pbkdf2:${ITERATIONS}:${salt}:${hash}`;
}

function isPasswordHash(value) {
  return typeof value === 'string' && value.startsWith('pbkdf2:');
}

module.exports = {
  hashPassword,
  isPasswordHash
};
