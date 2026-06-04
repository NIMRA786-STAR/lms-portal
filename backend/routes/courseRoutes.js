const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  addLesson
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes (no authentication needed)
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes (authentication required)
router.use(protect);

// Instructor routes
router.get('/instructor/my-courses', authorize('instructor', 'admin'), getInstructorCourses);
router.post('/', authorize('instructor', 'admin'), createCourse);
router.post('/:id/lessons', authorize('instructor', 'admin'), addLesson);
router.put('/:id', authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', authorize('instructor', 'admin'), deleteCourse);


module.exports = router;