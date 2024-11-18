const express = require('express');
const {
    addActivity, 
    getLessonPlans, 
    getAllActivities, 
    createLesson,
    createSuggestedActivities,
    updateSelectedActivity,
    getSkills
} = require('../controllers/activityController')

const router = express.Router();

// Route to create a new lesson
router.post('/newLesson', createLesson);

// Route to create suggested activities
router.post('/addSuggestedActivities', createSuggestedActivities);

// Route to update selected activity
router.put('/updateSelectedActivity', updateSelectedActivity);

// Route to get all activities
router.get('/getAllActivities', getAllActivities);

// Route to get lesson plans by fellow email
router.get('/getLessonPlan', getLessonPlans);

// Route to add a new activity
router.post('/newActivity', addActivity);

// Route to get skills
router.get('/getSkills', getSkills);

module.exports = router;
