const express = require('express');
const router = express.Router();

const postCtrl = require('../controller/post');

router.post('/messages/new', postCtrl.createPost);
router.get('/messages', postCtrl.getPost);

module.exports = router;