const express = require('express');
const { addMessage, getMessageHistory } = require('../controllers/messageController');

const router = express.Router();

// Add a message
router.post('/add', addMessage);

// Get message history
router.get('/history', getMessageHistory);

module.exports = router;
