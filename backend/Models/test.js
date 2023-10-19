const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const TestSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  questions: {
    type: [QuestionSchema],
    required: true,
  },
});

const Test = mongoose.model('Test', TestSchema);
const Question = mongoose.model('Question', QuestionSchema);

module.exports = Test;