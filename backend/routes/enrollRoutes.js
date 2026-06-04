const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getMyCourses,
  updateProgress,
  dropCourse
} = require('../controllers/enrollController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('student'));

router.post('/', enrollCourse);
router.get('/my-courses', getMyCourses);
router.put('/progress/:id', updateProgress);
router.delete('/:id', dropCourse);

module.exports = router;