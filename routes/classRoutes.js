const express = require('express');
const {
    createClass,
    createStudent
} = require('../controllers/classController')

const router = express.Router();

// Route to create a new class
router.post('/newClass', createClass);

// Route to create a new student
router.post('/newStudent', createStudent);

module.exports = router;

