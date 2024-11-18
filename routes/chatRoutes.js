const express = require('express');
const { getChat } = require('../controllers/chatController')

const router = express.Router();

router.post('/getChat', getChat);

module.exports = router

