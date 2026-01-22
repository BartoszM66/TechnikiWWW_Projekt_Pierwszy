const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/database');

router.post('/register', async (req, res) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: 'Wszystkie pola (w tym telefon) są wymagane!' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, 'client')`;

        db.run(sql, [name, email, hashedPassword, phone], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ message: 'Taki email jest już zajęty.' });
                }
                return res.status(500).json({ message: 'Błąd bazy: ' + err.message });
            }
            res.status(201).json({ message: 'Rejestracja udana! Możesz się zalogować.' });
        });

    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera: ' + error.message });
    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Podaj email i hasło!' });
    }

    const sql = `SELECT * FROM users WHERE email = ?`;

    db.get(sql, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Błąd bazy danych.' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Błędny email lub hasło.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Błędny email lub hasło.' });
        }

        res.status(200).json({
            message: 'Zalogowano pomyślnie!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
});

module.exports = router;