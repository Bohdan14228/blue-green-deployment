// server.js

const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Переменные среды для Blue/Green ---
// читаем из окружения, иначе дефолт
const ENV_COLOR   = process.env.ENV_COLOR   || 'No';
const ENV_VERSION = process.env.ENV_VERSION || 'No';
const mongoUri    = 'mongodb://mongo:27017/myDatabase';

// 1. Подключение к MongoDB
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// 3. Главный маршрут
app.get('/', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1
    ? 'Connected (Подключено)'
    : 'Disconnected (Отключено)';

  let htmlContent;
  try {
    htmlContent = fs.readFileSync(path.join(__dirname, 'index_green.html'), 'utf-8');
  } catch (error) {
    console.error('Error reading HTML:', error);
    return res.status(500).send('Error reading HTML file.');
  }

  const finalHtml = htmlContent
    .replace(/{{APP_COLOR}}/g, ENV_COLOR)
    .replace(/{{APP_VERSION}}/g, ENV_VERSION)
    .replace(/{{DB_STATUS}}/g, dbStatus)
    .replace('#007bff', ENV_COLOR === 'GREEN' ? '#28a745' : '#007bff'); 

  res.status(200).send(finalHtml);
});

// /health
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'OK' : 'ERROR';
  res.status(200).json({ status: 'OK', db: dbStatus });
});

app.listen(PORT, () => {
  console.log(`[${ENV_COLOR} V${ENV_VERSION}] Server running on port ${PORT}`);
});
