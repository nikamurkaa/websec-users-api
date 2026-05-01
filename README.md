# WebSec Users API

Учебный backend-проект по безопасности API: небольшое приложение на **Node.js + Express**, в котором реализованы безопасные сценарии управления пользователями.

Проект показывает, как защищать API от типичных ошибок:

- раскрытие лишних данных в ответах API;
- отсутствие проверки прав доступа;
- доступ пользователя к чужим данным;
- небезопасное обновление полей пользователя;
- mass assignment / попытка повысить роль через тело запроса.

> Проект является учебным security lab и предназначен для портфолио. Это не production-ready система авторизации.

## Что демонстрирует проект

В проекте реализованы:

- REST API на Express;
- разделение приложения на `app`, `server`, `routes`, `middleware`, `services`, `data`;
- Bearer token authentication для демонстрации контроля доступа;
- role-based authorization для admin/user;
- owner-based authorization: пользователь может читать и изменять только свой профиль;
- фильтрация ответов: API не отдаёт `passwordHash`, `token`, `internalNotes`, `databaseId`;
- allowlist-валидация обновлений: разрешены только `displayName`, `email`, `password`;
- единый JSON-формат ошибок;
- OpenAPI-спецификация;
- Postman-коллекция;
- автотесты на встроенном `node:test`;
- GitHub Actions CI.

## Стек технологий

- Node.js
- Express
- JavaScript
- Node.js Test Runner
- OpenAPI
- Postman
- GitHub Actions

## Структура проекта

```text
websec-users-api/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── data/
│   │   └── users.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errors.js
│   ├── routes/
│   │   └── users.js
│   ├── services/
│   │   └── users.js
│   └── utils/
│       └── password.js
├── tests/
│   └── users-api.test.js
├── docs/
│   ├── manual-checks.md
│   ├── openapi.yaml
│   ├── security-model.md
│   └── test-plan.md
├── postman/
│   ├── websec-users-api.postman_collection.json
│   └── websec-users-api.local.postman_environment.json
├── .github/workflows/ci.yml
├── .env.example
├── .editorconfig
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

## Установка и запуск

### 1. Клонировать репозиторий

```bash
git clone https://github.com/kindarufy/websec-users-api.git
cd websec-users-api
```

### 2. Установить зависимости

```bash
npm install
```

### 3. Запустить приложение

```bash
npm start
```

По умолчанию API будет доступно по адресу:

```text
http://localhost:3000
```

## Переменные окружения

Пример переменных находится в файле `.env.example`:

```env
PORT=3000
ADMIN_TOKEN=admin-demo-token
USER_TOKEN=user-demo-token
```

Если переменные окружения не заданы, приложение использует demo-токены по умолчанию.

## Demo-токены

| Роль | Bearer token |
|---|---|
| Admin | `admin-demo-token` |
| User | `user-demo-token` |

Пример заголовка:

```http
Authorization: Bearer admin-demo-token
```

## API endpoints

### Health check

```http
GET /health
```

Пример ответа:

```json
{
  "status": "ok",
  "service": "websec-users-api"
}
```

### Получить текущего пользователя

```http
GET /users/me
Authorization: Bearer user-demo-token
```

### Получить список пользователей

```http
GET /users
Authorization: Bearer admin-demo-token
```

Доступно только администратору.

Ответ не содержит чувствительных полей:

```json
[
  {
    "id": "usr_admin_001",
    "username": "admin",
    "displayName": "System Administrator",
    "email": "admin@example.com",
    "role": "admin"
  }
]
```

### Получить пользователя по ID

```http
GET /users/usr_user_001
Authorization: Bearer user-demo-token
```

Обычный пользователь может получить только свой профиль. Администратор может получить любой профиль.

### Обновить пользователя

```http
PATCH /users/usr_user_001
Authorization: Bearer user-demo-token
Content-Type: application/json
```

Разрешены только эти поля:

- `displayName`
- `email`
- `password`

Пример корректного запроса:

```json
{
  "displayName": "Updated User",
  "email": "updated@example.com"
}
```

Попытка изменить роль будет отклонена:

```json
{
  "role": "admin"
}
```

Пример ответа:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid update payload.",
    "details": [
      "Only displayName, email and password can be updated. Forbidden fields: role."
    ]
  }
}
```

## Безопасность API

Проект демонстрирует защиту от нескольких типичных API security проблем.

| Проблема | Как исправлено |
|---|---|
| Excessive Data Exposure | В ответах используется public DTO без `passwordHash`, `token`, `internalNotes`, `databaseId` |
| Broken Object Level Authorization | Пользователь может читать и изменять только свой профиль |
| Broken Function Level Authorization | Список всех пользователей доступен только admin |
| Mass Assignment | Обновление работает только через allowlist полей |
| Plaintext Password Storage | Пароли не хранятся в открытом виде, используется PBKDF2 hash |

Подробнее: [`docs/security-model.md`](docs/security-model.md)

## Ручная проверка

Все команды для ручной проверки находятся в файле:

```text
docs/manual-checks.md
```

Пример проверки списка пользователей от имени администратора:

```bash
curl -H "Authorization: Bearer admin-demo-token" http://localhost:3000/users
```

Пример проверки запрета mass assignment:

```bash
curl -X PATCH http://localhost:3000/users/usr_user_001 \
  -H "Authorization: Bearer admin-demo-token" \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}'
```

## Автотесты

Запуск тестов:

```bash
npm test
```

Проверка синтаксиса основных файлов:

```bash
npm run check
```

В тестах проверяется:

- доступность `/health`;
- запрет доступа без токена;
- запрет просмотра списка пользователей обычному пользователю;
- доступ администратора к списку пользователей;
- отсутствие чувствительных полей в ответах;
- доступ пользователя к своему профилю;
- запрет доступа к чужому профилю;
- запрет mass assignment;
- успешное обновление разрешённых полей.

## OpenAPI

Спецификация API находится в файле:

```text
docs/openapi.yaml
```

Её можно открыть в Swagger Editor или использовать как документацию к API.

## Postman

Postman-коллекция и environment находятся в папке:

```text
postman/
```

Импортируй в Postman:

- `websec-users-api.postman_collection.json`
- `websec-users-api.local.postman_environment.json`

## CI

В проекте настроен GitHub Actions workflow:

```text
.github/workflows/ci.yml
```

CI устанавливает зависимости, проверяет синтаксис и запускает автотесты.

## Статус проекта

Проект выполнен как учебная работа по безопасности веб-приложений и оформлен как портфолио-проект. Он показывает понимание базовых принципов API Security и аккуратную организацию небольшого backend-приложения.

