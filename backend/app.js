// Imports
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const fs = require('fs');
const cors = require('cors');


const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require("./routes/comments");

// Instantiate server
const app = express();

// Configuration CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.ORIGINE);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configure routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(cors());
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/posts', commentsRoutes);

// Assainissement des entrées contre les attaques XSS
app.use(xss());

// Sécurise les Headers
app.use(helmet());

// Limite les demandes répétées pour évité les attaques de force
app.use(rateLimit());

// Sécurise les cookies de la session
app.set('trust proxy', 1)
app.use(session({
    secret: process.env.COOKIE_SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30000,
        secure: true
    }
}))

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send("Something went wrong.")
});

module.exports = app;