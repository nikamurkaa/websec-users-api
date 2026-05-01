const assert = require('node:assert/strict');
const { test, before, after } = require('node:test');
const { createApp } = require('../src/app');

const adminToken = 'admin-demo-token';
const userToken = 'user-demo-token';
let server;
let baseUrl;

function request(path, options = {}) {
  return fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers || {})
    }
  });
}

function authHeader(token) {
  return { authorization: `Bearer ${token}` };
}

before(async () => {
  const app = createApp();
  server = app.listen(0);

  await new Promise(resolve => server.once('listening', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('health endpoint returns service status', async () => {
  const response = await request('/health');
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, 'ok');
});

test('users list requires authentication', async () => {
  const response = await request('/users');
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(body.error.code, 'UNAUTHORIZED');
});

test('regular user cannot list all users', async () => {
  const response = await request('/users', {
    headers: authHeader(userToken)
  });
  const body = await response.json();

  assert.equal(response.status, 403);
  assert.equal(body.error.code, 'FORBIDDEN');
});

test('admin can list users without sensitive fields', async () => {
  const response = await request('/users', {
    headers: authHeader(adminToken)
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(Array.isArray(body), true);
  assert.equal(body.length, 2);
  assert.equal('passwordHash' in body[0], false);
  assert.equal('token' in body[0], false);
  assert.equal('internalNotes' in body[0], false);
  assert.equal('databaseId' in body[0], false);
});

test('user can read own profile', async () => {
  const response = await request('/users/usr_user_001', {
    headers: authHeader(userToken)
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.id, 'usr_user_001');
  assert.equal(body.role, 'user');
});

test('user cannot read another profile', async () => {
  const response = await request('/users/usr_admin_001', {
    headers: authHeader(userToken)
  });
  const body = await response.json();

  assert.equal(response.status, 403);
  assert.equal(body.error.code, 'FORBIDDEN');
});

test('mass assignment fields are rejected', async () => {
  const response = await request('/users/usr_user_001', {
    method: 'PATCH',
    headers: authHeader(adminToken),
    body: JSON.stringify({ role: 'admin' })
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error.code, 'VALIDATION_ERROR');
});

test('allowed update fields can be changed', async () => {
  const response = await request('/users/usr_user_001', {
    method: 'PATCH',
    headers: authHeader(userToken),
    body: JSON.stringify({ displayName: 'Updated User', email: 'updated@example.com' })
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.displayName, 'Updated User');
  assert.equal(body.email, 'updated@example.com');
  assert.equal('passwordHash' in body, false);
});
