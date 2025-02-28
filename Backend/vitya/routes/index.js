const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Портал ВШЩТ работает!');
});

router.get('/about', (req, res) => {
  res.send('Страница "О нас"');
});

module.exports = router;
