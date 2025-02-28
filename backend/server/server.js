const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3006;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname))); 

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    console.log('Регистрация:', username, password);
    res.status(200).json({ message: 'Пользователь зарегистрирован' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Вход:', username, password);
    res.status(200).json({ message: 'Вход успешен' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});