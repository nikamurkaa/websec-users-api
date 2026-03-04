# Лабораторная работа 5

# Задание:
Разработать Node.js + Express приложение с API для управления пользователями, содержащее уязвимости:
- Раскрытие избыточных данных (пароли, внутренние ID)
- Небезопасное обновление данных (нет проверки прав)
- Отсутствие фильтрации ответов

Затем реализовать защиту:
- Фильтрация ответов
- Проверка прав доступа (через промежуточный обработчик checkAdmin)
- Валидация обновлений (разрешены только email и password)

## Установка и запуск:
```bash
npm install
npm start 
```
## Проверка защиты:
1) Фильтрация ответа (пароли и id не отображаются)
```bash
Invoke-RestMethod http://localhost:3000/users
```
2) Проверка прав: без токена нельзя (403 Forbidden)
```bash
Invoke-WebRequest -Method Put -Uri "http://localhost:3000/users/2" -ContentType "application/json" -Body '{"role":"admin"}'
```
3) Валидация полей: role запрещён даже с токеном (400 Invalid updates)
```bash
Invoke-WebRequest -Method Put -Uri "http://localhost:3000/users/2?token=admin_token" -ContentType "application/json" -Body '{"role":"admin"}'
```
4) Разрешённые поля: email/password можно (200 OK)
```bash
Invoke-RestMethod -Method Put -Uri "http://localhost:3000/users/2?token=admin_token" -ContentType "application/json" -Body '{"email":"new@mail.com"}'
```
5) Проверка
```bash
Invoke-RestMethod http://localhost:3000/users
```
