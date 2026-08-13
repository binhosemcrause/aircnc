require('dotenv/config');
require('express-async-errors');

const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const multer = require('multer');

const routes = require('./routes');

const requiredEnv = ['MONGO_URL'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);
if (missingEnv.length) {
    console.error(`Missing required environment variable(s): ${missingEnv.join(', ')}`);
    process.exit(1);
}

const app = express();
const server = http.Server(app);

const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

const io = socketio(server, {
    cors: {
        origin: allowedOrigins.length ? allowedOrigins : false,
    },
});

const connectedUsers = {};

io.on('connection', socket => {
    const { user_id } = socket.handshake.query;

    if (user_id) {
        connectedUsers[user_id] = socket.id;
    }

    socket.on('disconnect', () => {
        if (user_id && connectedUsers[user_id] === socket.id) {
            delete connectedUsers[user_id];
        }
    });
});

mongoose.connect(process.env.MONGO_URL);

app.use(helmet());
app.use(cors({
    origin: allowedOrigins.length ? allowedOrigins : false,
}));
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
}));

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;
    next();
});

app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

// Keep error details out of responses; log them server-side instead.
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.status === 400) {
        return res.status(400).json({ error: err.message });
    }

    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
