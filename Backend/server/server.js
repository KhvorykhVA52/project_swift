const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json()); 

let dataStore = [];


app.get('/api/data', (req, res) => {
    res.json(dataStore); 
});

app.post('/api/data', (req, res) => {
    const newData = req.body; 
    dataStore.push(newData); 
    res.status(201).json({ message: 'Данные успешно добавлены', data: newData });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});