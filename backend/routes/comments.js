// Imports
const express = require('express');
const router = express.Router();

const commentsCtrl = require('../controller/commentsCtrl');
const auth = require('../middleware/auth');

router.post('/:id/comment', auth, commentsCtrl.createComment);
router.get('/comment', auth, commentsCtrl.getAllComments);
router.delete('/:id/comment', auth, commentsCtrl.deleteComment);

module.exports = router;