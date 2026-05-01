# Security model

This project is an educational API security lab. It demonstrates how a small Users API can be protected against several common API security mistakes.

## Protected risks

### 1. Excessive Data Exposure

The internal user objects contain fields that must not be returned to clients:

- `databaseId`
- `passwordHash`
- `token`
- `internalNotes`

The API returns only a public DTO:

- `id`
- `username`
- `displayName`
- `email`
- `role`

### 2. Broken Object Level Authorization

A regular user can access only their own profile. Admin users can access all profiles.

Protected endpoints:

- `GET /users/:userId`
- `PATCH /users/:userId`

### 3. Broken Function Level Authorization

Only an admin can list all users:

- `GET /users`

### 4. Mass Assignment

Only these fields are accepted in update requests:

- `displayName`
- `email`
- `password`

Fields such as `role`, `token`, `databaseId` and `internalNotes` are rejected.

### 5. Password storage

The demo does not store plaintext passwords. Password values are converted to PBKDF2 hashes before being stored in memory.

## Demo limitations

This is not a production authentication system. The project uses static demo tokens from environment variables to keep the lab small and easy to run locally.

For production, replace demo tokens with proper authentication and authorization, for example:

- OAuth 2.0 / OpenID Connect;
- signed JWT access tokens;
- secure session management;
- persistent database;
- rate limiting;
- centralized audit logging.
