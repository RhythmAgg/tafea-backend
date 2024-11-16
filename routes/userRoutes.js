const express = require('express');
const { 
    getUserProfile, 
    addUser, 
    loginUser,
    verifyOTP,
    requestOTP
} = require('../controllers/userController');
// const authMiddleware = require('../middlewares/auth'); // Middleware to verify JWT

const router = express.Router();

// Route to get user profile
router.get('/profile', getUserProfile);

// Route to add registered user details to database
router.post('/add', addUser)

// Route to login user if already registered before
// router.post('/login', loginUser)

router.post('/requestOTP', requestOTP)

router.post('/verifyOTP', verifyOTP)


module.exports = router;
