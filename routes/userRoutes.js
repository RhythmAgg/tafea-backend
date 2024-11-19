const express = require('express');
const { 
    getUserProfile, 
    addFellow,
    verifyOTP,
    requestOTP
} = require('../controllers/userController');
// const authMiddleware = require('../middlewares/auth'); // Middleware to verify JWT

const router = express.Router();

// Route to get user profile
router.get('/getFellowProfile', getUserProfile);

// Route to add registered user details to database
router.post('/addFellow', addFellow)

// Request OTP for login
router.post('/requestOTP', requestOTP)

// Request for OTP verification
router.post('/verifyOTP', verifyOTP)


module.exports = router;
