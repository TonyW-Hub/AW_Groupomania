const express = require('express');
const router = express.Router();

const likeCtrl = require('../controller/like');

router.post('/messages/:messageId/vote/like', likeCtrl.likePost);
router.post('/messages/:messagesId/vote/dislike', likeCtrl.dislikePost);

module.exports = router;