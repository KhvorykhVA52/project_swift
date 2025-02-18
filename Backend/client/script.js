document.getElementById('sendRequest').addEventListener('click', function() {
    fetch('http://localhost:3002/api/data', {
        method: 'GET' 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Сеть ответила с ошибкой: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Успех:', data);
    })
    .catch((error) => {
        console.error('Ошибка:', error);
    });
});