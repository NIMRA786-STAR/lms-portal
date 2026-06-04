const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

// @desc    Get all courses with search and filter
// @route   GET /api/courses
// @access  Public
const getAllCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = {};

    // Search by title or description
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by level
    if (level) {
      query.level = level;
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Error in getAllCourses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email bio');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error in getCourseById:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, duration, level, thumbnail } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const course = await Course.create({
      title,
      description,
      instructor: req.user._id,
      category: category || 'Programming',
      price: price || 0,
      duration: duration || '4 weeks',
      level: level || 'Beginner',
      thumbnail: thumbnail || 'https://via.placeholder.com/300x200?text=Course'
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Error in createCourse:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor/Admin)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check authorization
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });
  } catch (error) {
    console.error('Error in updateCourse:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor/Admin)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check authorization
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await course.deleteOne();

    // Delete all enrollments for this course
    await Enrollment.deleteMany({ course: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteCourse:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message
    });
  }
};

// @desc    Get instructor's courses
// @route   GET /api/courses/instructor/my-courses
// @access  Private (Instructor)
const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate('enrolledStudents', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Error in getInstructorCourses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching instructor courses',
      error: error.message
    });
  }
};

// @desc    Add lesson to course
// @route   POST /api/courses/:id/lessons
// @access  Private (Instructor)
const addLesson = async (req, res) => {
  try {
    const { title, content, videoUrl, duration } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Lesson title and content are required'
      });
    }

    course.lessons.push({ title, content, videoUrl, duration: duration || '00:00' });
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Lesson added successfully',
      data: course
    });
  } catch (error) {
    console.error('Error in addLesson:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding lesson',
      error: error.message
    });
  }
};

// @desc    Get enrolled students for a course
// @route   GET /api/courses/:id/students
// @access  Private/Instructor
const getEnrolledStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('enrolledStudents', 'name email profilePicture');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if instructor owns this course or is admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this course students'
      });
    }

    // Get progress for each student
    const studentsWithProgress = await Promise.all(
      course.enrolledStudents.map(async (student) => {
        const enrollment = await Enrollment.findOne({
          student: student._id,
          course: course._id
        });
        return {
          ...student.toObject(),
          progress: enrollment?.progress || 0,
          enrolledAt: enrollment?.enrolledAt
        };
      })
    );

    res.json({
      success: true,
      count: studentsWithProgress.length,
      data: studentsWithProgress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get course analytics for instructor
// @route   GET /api/courses/analytics
// @access  Private/Instructor
const getCourseAnalytics = async (req, res) => {
  try {
    // Get all courses by this instructor
    const courses = await Course.find({ instructor: req.user._id })
      .select('title price enrolledStudents lessons createdAt');

    const analytics = courses.map(course => ({
      _id: course._id,
      title: course.title,
      price: course.price,
      totalStudents: course.enrolledStudents?.length || 0,
      totalLessons: course.lessons?.length || 0,
      totalRevenue: (course.price || 0) * (course.enrolledStudents?.length || 0),
      createdAt: course.createdAt,
      completionRate: course.enrolledStudents?.length > 0 ? 0 : 0 // Will calculate below
    }));

    // Calculate completion rates for each course
    for (let i = 0; i < analytics.length; i++) {
      const course = courses[i];
      if (course.enrolledStudents?.length > 0) {
        const enrollments = await Enrollment.find({ 
          course: course._id,
          status: 'active'
        });
        const completedCount = enrollments.filter(e => e.progress === 100).length;
        analytics[i].completionRate = Math.round((completedCount / course.enrolledStudents.length) * 100);
        analytics[i].averageProgress = Math.round(
          enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length
        );
      }
    }

    // Overall stats
    const overallStats = {
      totalCourses: analytics.length,
      totalStudents: analytics.reduce((sum, c) => sum + c.totalStudents, 0),
      totalRevenue: analytics.reduce((sum, c) => sum + c.totalRevenue, 0),
      totalLessons: analytics.reduce((sum, c) => sum + c.totalLessons, 0),
      averageCompletionRate: analytics.length > 0 
        ? Math.round(analytics.reduce((sum, c) => sum + c.completionRate, 0) / analytics.length)
        : 0
    };

    res.json({
      success: true,
      overall: overallStats,
      courses: analytics
    });
  } catch (error) {
    console.error('Error in getCourseAnalytics:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  addLesson,
  getEnrolledStudents,
  getCourseAnalytics 
};