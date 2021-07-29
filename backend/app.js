// Imports
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');


const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const likeRoutes = require('./routes/like');

// Instantiate server
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configure routes
app.use('/api', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/post/like', likeRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send("Something went wrong.")
});

module.exports = app;
// // Launch server
// server.listen(6060, function() {
//     console.log('Server ok !');
// });