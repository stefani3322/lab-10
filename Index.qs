// server/index.js
const express = require('express');
const fetch = require('node-fetch'); // node 18+ можно использовать global fetch
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GAMES_API_KEY;

if (!API_KEY) {
  console.error('ERROR: Set GAMES_API_KEY in .env');
  process.exit(1);
}

// Пример эндпоинта: /api/games?q=zelda&page_size=10
app.get('/api/games', async (req, res) => {
  try {
    const q = req.query.q || '';
    const page_size = req.query.page_size || 12;

    // Замените базовый URL при необходимости (RAWG пример)
    const apiUrl = https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(q)}&page_size=${page_size};

    const response = await fetch(apiUrl);
    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({ error: 'Upstream API error', details: text });
    }
    const data = await response.json();
    // Отправляем клиенту только нужные поля (без ключа)
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Раздача статических файлов client (опционально)
app.use('/', express.static('../client'));

app.listen(PORT, () => {
  console.log(Server running on http://localhost:${PORT});
});          indes.js
