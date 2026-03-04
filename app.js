const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// "База данных" (для простоты)
let users = [
  { id: 1, username: 'admin', password: 'secret123', email: 'admin@test.com', role: 'admin' },
  { id: 2, username: 'user1', password: 'qwerty', email: 'user1@test.com', role: 'user' }
];

// 1. Уязвимость: раскрытие паролей и внутренних ID
app.get('/users', (req, res) => {
  res.json(users); // Отправляем ВСЕ данные
});

// 2. Уязвимость: нет проверки прав при обновлении
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).send('User not found');

  // Позволяем менять ЛЮБЫЕ поля без проверок
  Object.assign(user, req.body);

  res.json(user);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
