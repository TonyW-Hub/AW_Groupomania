// Imports
const express = require('express');
const router = express.Router();

const postsCtrl = require('../controller/postsCtrl');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/new', auth, multer, postsCtrl.createPost);
router.get('/', auth, postsCtrl.findAll);
router.delete('/:id', auth, postsCtrl.deletePost);

module.exports = router;