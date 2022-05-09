const mongoose = require('mongoose');
const ms = require('ms');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  role: {
    type: String,
    enum: ['User', 'Admin'],
    default: 'User',
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  // Generate salt with 10 rounds
  const salt = await bcrypt.genSalt(10);
  // Hash the password
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function (duration) {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: duration,
  });
};

// Compare the plain password to hashed password in the database
UserSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
