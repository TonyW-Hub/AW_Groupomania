const express = require('express');
const router = express.Router();

const postCtrl = require('../controller/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/messages/new', auth, multer, postCtrl.createPost);
router.get('/messages', auth, postCtrl.getPost);

module.exports = router;