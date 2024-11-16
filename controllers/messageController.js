const { Message } = require('../models/model');

// Add a message
const addMessage = async (req, res) => {
  try {
    const { email, text, sentByUser } = req.body;

    if (!email || !text || sentByUser === undefined) {
      return res.status(400).json({ message: 'Email, text, and sentByUser are required' });
    }

    // Find the user's message history or create a new one
    const messageDoc = await Message.findOneAndUpdate(
      { userEmail: email },
      { $push: { messages: { text, sentByUser } } }, // Append the new message
      { new: true, upsert: true } // Create a new document if it doesn't exist
    );

    res.status(200).json({ message: 'Message added successfully', data: messageDoc });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get message history
const getMessageHistory = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const messageDoc = await Message.findOne({ userEmail: email });
    if (!messageDoc) {
      return res.status(404).json({ message: 'No message history found for this email' });
    }

    res.status(200).json({ messages: messageDoc.messages });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { addMessage, getMessageHistory };

