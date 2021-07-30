// Imports
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const session = require('express-session');
const nocache = require('nocache');
const fs = require('fs');


const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

// Instantiate server
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Sécurise les Headers
app.use(helmet());

// Désactive la mise en cache du navigateur
app.use(nocache());

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

// Configure routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send("Something went wrong.")
});

module.exports = app;