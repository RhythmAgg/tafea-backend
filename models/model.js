const mongoose = require('mongoose');

// TFI Fellow Schema
const fellowSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Hash the password before saving the user
fellowSchema.pre('save', async function (next) {
    if (this.isModified('passwordHash')) {
        const salt = await bcrypt.genSalt(10); // Generate salt
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt); // Hash the password
    }
    next();
});

// Compare the password entered by the user with the stored hash
fellowSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.passwordHash);
};

// Student Schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    roll_no: { type: String, required: true},
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Class Schema
const classSchema = new mongoose.Schema({
    standard: { type: String, required: true },
    students: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// School Schema
const schoolSchema = new mongoose.Schema({
    schoolName: { type: String, required: true },
    location: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Lesson Schema
const lessonSchema = new mongoose.Schema({
    mailId: {type: String, unique: true},
    lesson_name: { type: String, required: true , unique: true},
    activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

// Activity Schema
const activitySchema = new mongoose.Schema({
    activityName: { type: String, required: true },
    skills: [{ type: String, required: true }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Performance Rating Schema
const performanceRatingSchema = new mongoose.Schema({
    fellowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fellow', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Activity Rating Schema
const activityRatingSchema = new mongoose.Schema({
    fellowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fellow', required: true },
    activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
    feedback: { type: String, required: false},
    skillRating: [{ type: String, required: true }], // pass in the ratings as a list of strings in the format: ["skill_name1: rating_", "skill_name2: rating" ...]
    createdAt: { type: Date, default: Date.now },
});

// Gemini Feedback Schema
const geminiFeedbackSchema = new mongoose.Schema({
    fellowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fellow', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    performanceRatingId: { type: mongoose.Schema.Types.ObjectId, ref: 'PerformanceRating', required: true },
    activityRatingId: { type: mongoose.Schema.Types.ObjectId, ref: 'ActivityRating', required: true },
    createdAt: { type: Date, default: Date.now },
});

// Message Schema
const MessageSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true, // Email of the user
    },
    messages: [
        {
            text: { type: String, required: true }, // Message text
            timestamp: { type: Date, default: Date.now }, // When the message was sent
            sentByUser: { type: Boolean, required: true }, // true if sent by the user, false if received
        },
    ],
});

// Models
const Fellow = mongoose.model('Fellow', fellowSchema);
const Student = mongoose.model('Student', studentSchema);
const Class = mongoose.model('Class', classSchema);
const Lesson = mongoose.model('Lesson', lessonSchema);
const School = mongoose.model('School', schoolSchema);
const Activity = mongoose.model('Activity', activitySchema);
const PerformanceRating = mongoose.model('PerformanceRating', performanceRatingSchema);
const ActivityRating = mongoose.model('ActivityRating', activityRatingSchema);
const GeminiFeedback = mongoose.model('GeminiFeedback', geminiFeedbackSchema);
const Message = mongoose.model('Message', MessageSchema);


// Export Models
module.exports = {
    Fellow,
    Student,
    Class,
    Lesson,
    School,
    Activity,
    PerformanceRating,
    ActivityRating,
    GeminiFeedback,
    Message,
};