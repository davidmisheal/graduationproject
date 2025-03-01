const express = require('express');

const router = express.Router();

const messageController = require('../controllers/messageController');

router.post('/', messageController.createMessage);

router.get('/:chatId', messageController.getMessagesByChat);

module.exports = router;
