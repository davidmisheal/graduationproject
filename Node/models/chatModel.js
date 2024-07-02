const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    // Ensure members are defined correctly if used
    members: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour'
      }
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
