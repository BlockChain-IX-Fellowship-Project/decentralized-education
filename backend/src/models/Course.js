import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  title: String,
  videoLinks: [String],
  docLinks: [String],
  quizzes: [quizSchema]
}, { _id: false });

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  contributor: String,
  sections: [sectionSchema]
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
