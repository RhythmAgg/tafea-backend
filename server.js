require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const cors = require('cors');
const errorHandler = require('./utils/errorHandler');
// const loggingRoute = require('./routes/login');
const userRoute = require('./routes/userRoutes')
const messagesRoute = require('./routes/messageRoutes')
const classRoute = require('./routes/classRoutes');
const chatRoute = require('./routes/chatRoutes')
const feedbackRoute = require('./routes/feedbackRoutes');
const lessonRoute = require('./routes/lessonRoutes');

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
// app.use('/api', loggingRoute);
app.use('/api/users', userRoute);
app.use('/api/messages', messagesRoute);
app.use('/api/classes', classRoute);
app.use('/api/chat', chatRoute);
app.use('/api/feedback', feedbackRoute);
app.use('/api/lessons', lessonRoute);

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
