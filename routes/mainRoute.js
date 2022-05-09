const express = require('express');
const router = express.Router();
const Items = require('../models/items');
const Users = require('../models/users');
const { protect } = require('../middleware/auth');

// Get all items
router.get('/items', async (req, res) => {
  try {
    const items = await Items.find();
    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Add new item
router.post('/item', protect, async (req, res) => {
  try {
    const body = req.body;
    body.userId = req.user;
    const item = await Items.create(body);
    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get item for specific user id
router.get('/item/user', protect, async (req, res) => {
  try {
    const userId = req.user;
    const item = await Items.find({ userId });
    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get item from the type
router.get('/item/type/:type', async (req, res) => {
  try {
    const item = await Items.find({ type: req.params.type });
    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// get item
router.get('/item/:id', async (req, res) => {
  try {
    const item = await Items.findById(req.params.id);
    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// delete item
router.delete('/item/:id', protect, async (req, res) => {
  try {
    const item = await Items.findById(req.params.id);
    await item.remove();
    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// update item
router.put('/item/:id', protect, async (req, res) => {
  try {
    const item = await Items.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Add comment to item
router.post('/item/:id/comment', protect, async (req, res) => {
  try {
    const item = await Items.findById(req.params.id);
    const body = req.body;
    body.userId = req.user;
    item.comments.push(body);
    await item.save();
    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete all items from the database
router.delete('/delete/all', protect, async (req, res) => {
  try {
    await Items.deleteMany();
    await Users.deleteMany();
    res.json({
      success: true,
      message: 'All the items have been deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
