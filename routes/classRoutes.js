const express = require('express');
const {
    createClass,
    createStudent,
    getClassesByFellow
} = require('../controllers/classController')

const router = express.Router();

// Route to create a new class
router.post('/newClass', createClass);

// Route to create a new student
router.post('/newStudent', createStudent);

// Route to get classes by fellow email
router.get('/getClassesByFellow', getClassesByFellow);

module.exports = router;

