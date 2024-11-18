const { ActivityRating, PerformanceRating } = require('../models/model');


const addPerformanceRating = async (req, res) => {
    try {
      const { fellowId, studentId, activityId, rating } = req.body;
  
      // Validate required fields
      if (!fellowId || !studentId || !activityId || rating === undefined) {
        return res.status(400).json({ message: 'fellowId, studentId, activityId, and rating are required' });
      }
  
      // Create a new performance rating
      const performanceRating = new PerformanceRating({
        fellowId,
        studentId,
        activityId,
        rating,
      });
  
      await performanceRating.save();
  
      res.status(201).json({
        message: 'Performance rating added successfully',
        performanceRating,
      });
    } catch (error) {
      console.error('Error adding performance rating:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  
  const addActivityRating = async (req, res) => {
    try {
      const { fellowId, activityId, feedback, skillRating } = req.body;
  
      // Validate required fields
      if (!fellowId || !activityId || !skillRating) {
        return res.status(400).json({ message: 'fellowId, activityId, and skillRating are required' });
      }
  
      // Create a new activity rating
      const activityRating = new ActivityRating({
        fellowId,
        activityId,
        feedback: feedback || '',
        skillRating,
      });
  
      await activityRating.save();
  
      res.status(201).json({
        message: 'Activity rating added successfully',
        activityRating,
      });
    } catch (error) {
      console.error('Error adding activity rating:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  
  const fetchPerformanceRatings = async (req, res) => {
    try {
      const { fellowId } = req.query;
  
      // Fetch ratings, optionally filtered by fellowId
      const query = fellowId ? { fellowId } : {};
      const performanceRatings = await PerformanceRating.find(query)
        .populate('fellowId', 'name email')
        .populate('studentId', 'name roll_no')
        .populate('activityId', 'activityName');
  
      if (!performanceRatings.length) {
        return res.status(404).json({ message: 'No performance ratings found' });
      }
  
      res.status(200).json({
        message: 'Performance ratings fetched successfully',
        performanceRatings,
      });
    } catch (error) {
      console.error('Error fetching performance ratings:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  const fetchActivityRatings = async (req, res) => {
    try {
      const { fellowId } = req.query;
  
      // Fetch ratings, optionally filtered by fellowId
      const query = fellowId ? { fellowId } : {};
      const activityRatings = await ActivityRating.find(query)
        .populate('fellowId', 'name email')
        .populate('activityId', 'activityName activityDescription');
  
      if (!activityRatings.length) {
        return res.status(404).json({ message: 'No activity ratings found' });
      }
  
      res.status(200).json({
        message: 'Activity ratings fetched successfully',
        activityRatings,
      });
    } catch (error) {
      console.error('Error fetching activity ratings:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  
  module.exports = { addPerformanceRating, addActivityRating, fetchPerformanceRatings, fetchActivityRatings }