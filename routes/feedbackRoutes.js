const express = require('express');
const { addActivityRating, addPerformanceRating, fetchActivityRatings, fetchPerformanceRatings } = require('../controllers/feedbackController')

const router = express.Router();

router.post('rateActivity', addActivityRating);
router.post('rateStudent', addPerformanceRating);
router.get('activityRating', fetchActivityRatings);
router.get('studentRating', fetchPerformanceRatings);

module.exports = router

