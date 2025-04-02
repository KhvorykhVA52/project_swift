import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

// Добавьте интерцепторы, если они нужны
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Ошибка авторизации:', error);
      // Дополнительная обработка 401 ошибки
    }
    return Promise.reject(error);
  }
);

export { api }; // Явный экспорт именованного объекта