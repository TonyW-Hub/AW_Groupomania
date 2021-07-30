const express = require('express');
const router = express.Router();

const userCtrl = require('../controller/user');
const auth = require('../middleware/auth');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/me', auth, userCtrl.userProfile);
router.put('/update', auth, userCtrl.updateUserProfile);
router.delete('/delete', auth, userCtrl.deleteProfile);

module.exports = router;