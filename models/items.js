const mongoose = require('mongoose');
const shortid = require('shortid');
shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);

const ItemsSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  comments: [
    {
      _id: {
        type: String,
        default: shortid.generate,
      },
      data: {
        type: String,
        required: true,
      },
      userId: {
        type: String,
      },
    },
  ],
  description: {
    type: String,
  },

  image: {
    type: String,
  },

  userId: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Items', ItemsSchema);
