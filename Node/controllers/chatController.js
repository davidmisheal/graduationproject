const Chat = require('../models/chatModel');
const mongoose = require('mongoose');

exports.createChat = async (req, res) => {
  const { userId, tourId, booking } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(tourId) ||
      !mongoose.Types.ObjectId.isValid(booking)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid user ID, tour ID, or booking ID'
    });
  }

  try {
    console.log("Received data:", { userId, tourId, booking });

    // Check if a chat already exists for this user and tour
    let chat = await Chat.findOne({ 'members.user': userId, 'members.tour': tourId, booking });

    if (chat) {
      return res.status(200).json({
        status: 'success',
        data: { chat }
      });
    }

    // Create a new chat instance
    const newChat = new Chat({
      members: {
        user: userId,
        tour: tourId
      },
      booking
    });

    const savedChat = await newChat.save();
    res.status(201).json({
      status: 'success',
      data: {
        chat: savedChat
      }
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};



// Controller to get all chats for the authenticated user or tour
exports.getAllChats = async (req, res) => {
  try {
    // This assumes you have some way to identify whether the request comes from a user or a tour
    const userId = req.user.id; // or tourId from auth token
    const chats = await Chat.find({
      $or: [{ 'members.user': userId }, { 'members.tour': userId }]
    }).populate('members.user members.tour');

    res.status(200).json({
      status: 'success',
      results: chats.length,
      data: { chats }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Controller to get a specific chat by ID
exports.getChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId).populate(
      'members.user members.tour'
    );

    if (!chat) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No chat found with that ID' });
    }

    res.status(200).json({
      status: 'success',
      data: { chat }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Controller to delete a chat session
exports.deleteChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findByIdAndDelete(chatId);

    if (!chat) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No chat found with that ID' });
    }

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Controller to get chats for a specific user
exports.getChatsForUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await Chat.find({ 'members.user': userId }).populate(
      'members.tour'
    );

    res.status(200).json({
      status: 'success',
      results: chats.length,
      data: { chats }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Controller to get chats for a specific tour
exports.getChatsForTour = async (req, res) => {
  const { tourId } = req.params;

  try {
    const chats = await Chat.find({ 'members.tour': tourId }).populate(
      'members.user'
    );

    res.status(200).json({
      status: 'success',
      results: chats.length,
      data: { chats }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
