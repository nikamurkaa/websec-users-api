**English** | [Русский](README.ru.md)

# WebSec Users API

**WebSec Users API** is an educational security lab built with **Node.js + Express**, focused on secure user data management and access control in REST APIs.

The project addresses common API Security mistakes: exposing internal fields, accessing other users' objects, insufficient authorization, and mass assignment.

> This is an educational security lab, not a production-ready identity service.

## Skills demonstrated

- Bearer token authentication for a demonstration API;
- role-based authorization for `admin` and `user`;
- owner-based access control: users can work only with their own profiles;
- response filtering: `passwordHash`, tokens, internal notes, and database IDs are not exposed;
- an allowlist of updatable fields;
- protection against mass assignment and attempts to elevate roles through the request body;
- a consistent JSON error format;
- OpenAPI, Postman, automated tests, and GitHub Actions CI.

## Tech stack

- Node.js
- Express
- JavaScript
- Node.js Test Runner
- OpenAPI
- Postman
- GitHub Actions

## Structure

```text
websec-users-api/
├── src/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── data/
│   └── utils/
├── tests/
├── docs/
├── postman/
├── .github/workflows/ci.yml
├── .env.example
├── package.json
└── README.md
```

## Local setup

Use Node.js 22 (minimum 18). Check `node --version`.

Run the commands from the repository root. In PowerShell, copy the environment file
with `Copy-Item .env.example .env`.

```bash
git clone https://github.com/nikamurkaa/websec-users-api.git
cd websec-users-api
npm ci
cp .env.example .env
node --env-file=.env src/server.js
```

The command above targets Node.js 22 and explicitly loads `.env`.
`npm start` uses only process environment variables and built-in defaults;
the script does not read `.env` on its own.

Default API address:

```text
http://localhost:3000
```

Stop the server with `Ctrl+C`.

Example `.env`:

```env
PORT=3000
ADMIN_TOKEN=admin-demo-token
USER_TOKEN=user-demo-token
```

These tokens are local demonstration values only.

## Main endpoints

| Method | Endpoint | Access |
| --- | --- | --- |
| `GET` | `/health` | Public |
| `GET` | `/users/me` | Authenticated user |
| `GET` | `/users` | Admin |
| `GET` | `/users/:id` | Owner or admin |
| `PATCH` | `/users/:id` | Owner or admin, with field restrictions |

Allowed update fields:

- `displayName`;
- `email`;
- `password`.

Requests containing `role`, internal IDs, or other disallowed fields are rejected.

## Security model

| Risk | Protection |
| --- | --- |
| Sensitive data exposure | public DTO / response filtering |
| Broken object authorization | owner check + admin override |
| Excessive privileges | RBAC |
| Mass assignment | PATCH field allowlist |
| Inconsistent errors | Central JSON error handler |

See [`docs/security-model.md`](docs/security-model.md) for details.

## Security control demonstrations

### Sensitive data filtering

The API returns only public user data. Responses exclude internal fields, including password hashes, tokens, internal notes, and database IDs.

![WebSec Users API — response filtering](docs/assets/users-api-response-filtering.png)

### Object-level access control

A regular user cannot retrieve another user's profile. Attempts to access another user's object are rejected with `403 Forbidden`.

![WebSec Users API — owner access denied](docs/assets/users-api-owner-access-denied.png)

### Mass assignment protection

An attempt to change the protected `role` field through a regular `PATCH` request is rejected by allowlist validation.

![WebSec Users API — mass assignment blocked](docs/assets/users-api-mass-assignment-blocked.png)

## Verification

```bash
npm test
npm run check
```

Manual scenarios: [`docs/manual-checks.md`](docs/manual-checks.md).  
OpenAPI: [`docs/openapi.yaml`](docs/openapi.yaml).  
Postman: [`postman/`](postman/).

## Status

Completed as an educational lab on **API authorization, object-level access control, and user data protection**.

## Author

[Nicole Zhurbenko](https://github.com/nikamurkaa)
