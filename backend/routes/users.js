// Imports
const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");

const usersCtrl = require('../controller/usersCtrl');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Limite le nombre d'essais par connexion
const rateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // bloque pendant 5min
    max: 55, // max 5 essaies
    message: "Trop de tentatives échouées, réessayez dans 5 minutes",
});

router.post('/signup', usersCtrl.signup);
router.post('/login', rateLimiter, usersCtrl.login);
router.post('/google/login', usersCtrl.googleLogin);
router.get('/profile', auth, usersCtrl.findOne);
router.get('/', auth, usersCtrl.findAll);
router.delete('/:id', auth, usersCtrl.delete);
router.put('/:id', auth, multer, usersCtrl.update);

module.exports = router;