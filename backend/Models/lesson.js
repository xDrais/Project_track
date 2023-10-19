const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  titleLesson: {
    type: String,
  },
  descriptionLesson: {
    type: String,
  },
  contentLesson: {
    type: String,
  },
  typeLesson:{
    type: String,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;