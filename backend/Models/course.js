const mongoose = require('mongoose');
const Lesson = require('./lesson');

const reviewSchema = mongoose.Schema(
    {
      name: { type: String, required: true },
      rating: { type: Number,  },
      comment: { type: String,  },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    },
  )
const courseSchema = new mongoose.Schema({
  titleCourse: {
    type: String,
  },  
  thumbnailCourse: {
    type: String,
  },  
  category: {
    type: String,
  },
  descriptionCourse: {
    type: String,
  },
  coach: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  DateCourse: {
    type: Date,
    default: Date.now
  },
    rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  reviews: [reviewSchema],
  lessons: [Lesson.schema]

}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
