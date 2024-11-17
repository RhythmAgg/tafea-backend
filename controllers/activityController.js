const { Activity } = require('../models/model');

// Add Activity
const addActivity = async (req, res) => {
    try {
        const { activityName, skills } = req.body;

        // Validate the request body
        if (!activityName) {
            return res.status(400).json({ message: 'Activity name is required' });
        }

        if (!Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({ message: 'Skills must be a non-empty array of strings' });
        }

        // Create the activity
        const newActivity = new Activity({
            activityName,
            skills,
        });

        const savedActivity = await newActivity.save();
        res.status(201).json({
            message: 'Activity added successfully',
            activity: savedActivity,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get all activities
const getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.find({}, 'activityName _id'); // Fetch name and ID
        res.status(200).json({
            message: 'Activities fetched successfully',
            activities,
        });
    } catch (error) {
        console.error('Error fetching activities:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Fetch Lesson Plans by Fellow Email (No Authentication)
const getLessonPlans = async (req, res) => {
    try {
        // Fetch mailId from query parameters
        const { mailId } = req.query;

        if (!mailId) {
            return res.status(400).json({ message: 'Mail ID is required.' });
        }

        // Fetch lesson plans associated with this mail ID
        const lessonPlans = await Lesson.find({ mailId })
            .populate('activityId', 'activityName skills') // Populate activity details if needed
            .select('lesson_name activityId createdAt updatedAt'); // Select specific fields to return

        if (!lessonPlans || lessonPlans.length === 0) {
            return res.status(404).json({ message: 'No lesson plans found for this email ID.' });
        }

        // Return the lesson plans
        res.status(200).json({ lessonPlans });
    } catch (error) {
        console.error('Error fetching lesson plans:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


module.exports = { addActivity, getLessonPlans, getAllActivities };
