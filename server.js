require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./models/database');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Trasy API
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Wystąpił błąd serwera!' });
});
app.listen(PORT, () => {
    console.log(`Serwer działa na: http://localhost:${PORT}`);
});