const { hashPassword } = require('../utils/password');

function createInitialUsers() {
  return [
    {
      databaseId: 1,
      publicId: 'usr_admin_001',
      username: 'admin',
      displayName: 'System Administrator',
      email: 'admin@example.com',
      role: 'admin',
      passwordHash: hashPassword('AdminPass123!'),
      internalNotes: 'Demo admin account. Do not expose this field in API responses.',
      token: process.env.ADMIN_TOKEN || 'admin-demo-token'
    },
    {
      databaseId: 2,
      publicId: 'usr_user_001',
      username: 'user1',
      displayName: 'Regular User',
      email: 'user1@example.com',
      role: 'user',
      passwordHash: hashPassword('UserPass123!'),
      internalNotes: 'Demo user account. This field is intentionally sensitive.',
      token: process.env.USER_TOKEN || 'user-demo-token'
    }
  ];
}

module.exports = {
  createInitialUsers
};
