const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(' Подключение к MongoDB установлено'))
.catch((err) => console.error(' Ошибка подключения к MongoDB:', err));

const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

app.listen(PORT, () => console.log(` Сервер запущен на порту ${PORT}`));