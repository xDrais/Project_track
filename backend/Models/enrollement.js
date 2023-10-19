const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  learner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  completionStatus: {
    type: String,
    enum: ['Not started', 'In progress', 'Completed'],
    default: 'Not started'
  },
  test: {
    type: String,
    enum: ['Passed', 'Failed', 'Not started'],
    default: 'Not started'
  }
}, { timestamps: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;