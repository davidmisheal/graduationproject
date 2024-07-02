const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const Tour = require('../models/tourModel');

exports.createMessage = async (req, res) => {
  const { senderId, chatId, text } = req.body;

  try {
    // Fetch the related chat to find the connected user or tour
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Chat not found' });
    }

    console.log('Chat:', chat);

    // Determine the sender type by checking both User and Tour collections
    let senderType;
    const user = await User.findById(senderId);
    if (user && user.role === 'user') {
      senderType = 'User';
    } else {
      const tour = await Tour.findById(senderId);
      if (tour && tour.role === 'tourguide') {
        senderType = 'Tour';
      }
    }

    if (!senderType) {
      return res.status(404).json({
        status: 'error',
        message: 'Sender not found or invalid senderId'
      });
    }

    console.log('Sender Type:', senderType);

    // Determine the recipient based on sender type
    let recipientId, recipientType;
    if (senderType === 'User') {
      recipientId = chat.members.tour; // Accessing chat.members.tour for the tour ID
      recipientType = 'Tour';
    } else if (senderType === 'Tour') {
      recipientId = chat.members.user; // Accessing chat.members.user for the user ID
      recipientType = 'User';
    }

    console.log('Recipient ID:', recipientId);
    console.log('Recipient Type:', recipientType);

    if (!recipientId || !recipientType) {
      return res.status(404).json({
        status: 'error',
        message: 'Recipient not found or invalid recipientId'
      });
    }

    // Create the message
    const message = new Message({
      chatId,
      sender: senderId,
      senderType,
      recipient: recipientId,
      recipientType,
      text
    });

    const savedMessage = await message.save();
    res
      .status(201)
      .json({ status: 'success', data: { message: savedMessage } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getMessagesByChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId }).populate('sender', 'name');
    res.status(200).json({
      status: 'success',
      results: messages.length,
      data: { messages }
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: 'Messages not found'
    });
  }
};
