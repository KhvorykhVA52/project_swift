const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' },
];

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ id: user.id, username: user.username }, 'jwtSecret', { expiresIn: '1h' });
        return res.json({ token });
    }

    res.sendStatus(401);
});

module.exports = router;
