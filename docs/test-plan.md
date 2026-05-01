# Test plan

## Goal

Verify that the Users API correctly protects sensitive user data and enforces authorization and update validation rules.

## Scope

The test scope includes:

- health endpoint;
- user authentication using Bearer tokens;
- admin-only access to the full users list;
- owner/admin access to a single user profile;
- response filtering;
- mass-assignment protection;
- validation of update payloads;
- consistent JSON error responses.

## Out of scope

The following areas are intentionally out of scope for this educational lab:

- real user registration;
- login/password authentication;
- database persistence;
- token refresh flow;
- rate limiting;
- production deployment.

## Test levels

- Manual API checks with cURL, PowerShell or Postman.
- Automated integration checks with Node.js built-in test runner.

## Test data

Default demo tokens:

| Role | Token |
|---|---|
| Admin | `admin-demo-token` |
| User | `user-demo-token` |

Default public user IDs:

| Role | Public ID |
|---|---|
| Admin | `usr_admin_001` |
| User | `usr_user_001` |
