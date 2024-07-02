const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Chat',
      required: true
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      required: true,
      refPath: 'senderType'
    },
    senderType: {
      type: String,
      required: true,
      enum: ['User', 'Tour']
    },
    recipient: {
      type: mongoose.Schema.ObjectId,
      required: true,
      refPath: 'recipientType'
    },
    recipientType: {
      type: String,
      required: true,
      enum: ['User', 'Tour']
    },
    text: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
