const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// "База данных" (для простоты)
let users = [
  { id: 1, username: 'admin', password: 'secret123', email: 'admin@test.com', role: 'admin' },
  { id: 2, username: 'user1', password: 'qwerty', email: 'user1@test.com', role: 'user' }
];

// 1) Защита: фильтрация ответов (не отдаём password и id)
app.get('/users', (req, res) => {
  const safeUsers = users.map(user => ({
    username: user.username,
    email: user.email,
    role: user.role
  }));
  res.json(safeUsers);
});

// 2) Защита: проверка прав (промежуточный обработчик)
function checkAdmin(req, res, next) {
  // В реальном приложении проверяйте JWT/сессию
  if (req.query.token !== 'admin_token') {
    return res.status(403).send('Forbidden');
  }
  next();
}

// 3) Защита: валидация обновлений
app.put('/users/:id', checkAdmin, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).send('User not found');

  const allowedUpdates = ['email', 'password']; // Разрешенные поля
  const updates = Object.keys(req.body);

  const isValid = updates.every(field => allowedUpdates.includes(field));
  if (!isValid) return res.status(400).send('Invalid updates');

  // Применяем только разрешённые поля
  updates.forEach(field => {
    user[field] = req.body[field];
  });

  // Отдаём безопасный ответ (без password/id)
  res.json({
    username: user.username,
    email: user.email,
    role: user.role
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
