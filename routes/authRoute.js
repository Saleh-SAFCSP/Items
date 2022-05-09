const express = require('express');
const router = express.Router();
const ms = require('ms');
const User = require('../models/user');
const ErrorResponse = require('../util/errorResponse');

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!email || !password || !username) {
      return next(
        new ErrorResponse(`Please send all the required fields`, 400)
      );
    }

    // Add user to the database
    const user = await User.create({
      username,
      email,
      password,
      role,
    });

    // Return jsonwebtoken
    const token = user.getSignedJwtToken(ms('1y'));
    res.status(201).json({
      message: 'User registered successfully',
      success: true,
      token,
    });
  } catch (error) {
    const status = error.name == 'ValidationError' ? 400 : 500;
    return next(new ErrorResponse(error, status));
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check  if email entered and password
    if (!email || !password) {
      return next(
        new ErrorResponse(`Please send all the required fields`, 400)
      );
    }

    // Check if user exist
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse(`Invalid username or password`, 400));
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(new ErrorResponse(`Invalid username or password`, 400));
    }

    // Create token
    const token = await user.getSignedJwtToken(ms('1y'));

    res.status(200).json({
      message: 'User logged in successfully',
      success: true,
      token,
    });
  } catch (error) {
    const status = error.name == 'ValidationError' ? 400 : 500;
    return next(new ErrorResponse(error.message, status));
  }
});

module.exports = router;
