const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router
  .route('/')
  .post(chatController.createChat) // Create a new chat
  .get(chatController.getAllChats); // Get all chats for the logged-in user or tour

router
  .route('/:chatId')
  .get(chatController.getChat) // Get a single chat
  .delete(chatController.deleteChat); // Delete a chat

router.route('/user/:userId').get(chatController.getChatsForUser); // Get chats for a specific user

router.route('/tour/:tourId').get(chatController.getChatsForTour); // Get chats for a specific tour

module.exports = router;
