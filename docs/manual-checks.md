# Manual checks

Run the API first:

```bash
npm start
```

Base URL:

```text
http://localhost:3000
```

## 1. Health check

```bash
curl http://localhost:3000/health
```

Expected result: `200 OK`.

## 2. Users list without token

```bash
curl http://localhost:3000/users
```

Expected result: `401 UNAUTHORIZED`.

## 3. Users list with regular user token

```bash
curl -H "Authorization: Bearer user-demo-token" http://localhost:3000/users
```

Expected result: `403 FORBIDDEN`.

## 4. Users list with admin token

```bash
curl -H "Authorization: Bearer admin-demo-token" http://localhost:3000/users
```

Expected result: `200 OK`.

The response must not contain:

- `passwordHash`
- `token`
- `internalNotes`
- `databaseId`

## 5. Read own profile

```bash
curl -H "Authorization: Bearer user-demo-token" http://localhost:3000/users/usr_user_001
```

Expected result: `200 OK`.

## 6. Try to read another profile

```bash
curl -H "Authorization: Bearer user-demo-token" http://localhost:3000/users/usr_admin_001
```

Expected result: `403 FORBIDDEN`.

## 7. Try mass assignment

```bash
curl -X PATCH http://localhost:3000/users/usr_user_001 \
  -H "Authorization: Bearer admin-demo-token" \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}'
```

Expected result: `400 VALIDATION_ERROR`.

## 8. Update allowed fields

```bash
curl -X PATCH http://localhost:3000/users/usr_user_001 \
  -H "Authorization: Bearer user-demo-token" \
  -H "Content-Type: application/json" \
  -d '{"displayName":"Updated User","email":"updated@example.com"}'
```

Expected result: `200 OK`.
