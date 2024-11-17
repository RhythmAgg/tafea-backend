const express = require('express');
const { 
    getUserProfile, 
    addUser,
    verifyOTP,
    requestOTP
} = require('../controllers/userController');
const { addActivity, getAllActivities } = require('../controllers/activityController');
// const authMiddleware = require('../middlewares/auth'); // Middleware to verify JWT

const router = express.Router();

// Route to get user profile
router.get('/profile', getUserProfile);

// Route to add registered user details to database
router.post('/add', addUser)

// Route to get user activities
router.post('/addActivity', addActivity);

// Route to get activities list
router.get('/activities', getAllActivities);

// Request OTP for login
router.post('/requestOTP', requestOTP)

// Request for OTP verification
router.post('/verifyOTP', verifyOTP)


module.exports = router;
