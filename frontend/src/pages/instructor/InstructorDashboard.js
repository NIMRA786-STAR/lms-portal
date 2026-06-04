import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Table, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({ title: '', content: '', videoUrl: '', duration: '' });
  const [editingLesson, setEditingLesson] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  const fetchInstructorCourses = async () => {
    try {
      const response = await axios.get('/api/courses/instructor/my-courses');
      console.log('Courses fetched:', response.data.data); // Debug log
      setCourses(response.data.data);
      
      const totalStudents = response.data.data.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0);
      const totalRevenue = response.data.data.reduce((sum, c) => sum + ((c.price || 0) * (c.enrolledStudents?.length || 0)), 0);
      
      setStats({
        totalCourses: response.data.data.length,
        totalStudents,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (window.confirm(`Are you sure you want to delete "${courseTitle}"? This cannot be undone.`)) {
      try {
        await axios.delete(`/api/courses/${courseId}`);
        alert('Course deleted successfully');
        fetchInstructorCourses();
      } catch (error) {
        alert('Failed to delete course');
      }
    }
  };

  const openLessonManager = (course) => {
    console.log('Opening lesson manager for:', course.title); // Debug log
    setSelectedCourse(course);
    setLessons(course.lessons || []);
    setShowLessonModal(true);
  };

  const handleLessonChange = (e) => {
    setNewLesson({
      ...newLesson,
      [e.target.name]: e.target.value
    });
  };

  const addLesson = async () => {
    if (!newLesson.title || !newLesson.content) {
      alert('Please fill in lesson title and content');
      return;
    }

    try {
      const response = await axios.post(`/api/courses/${selectedCourse._id}/lessons`, newLesson);
      setLessons(response.data.data.lessons);
      setNewLesson({ title: '', content: '', videoUrl: '', duration: '' });
      alert('Lesson added successfully');
      
      // Update the course in the list
      const updatedCourses = courses.map(c => 
        c._id === selectedCourse._id 
          ? { ...c, lessons: response.data.data.lessons }
          : c
      );
      setCourses(updatedCourses);
      setSelectedCourse({ ...selectedCourse, lessons: response.data.data.lessons });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add lesson');
    }
  };

  const updateLesson = async () => {
    try {
      const updatedLessons = lessons.map(lesson =>
        lesson._id === editingLesson._id ? editingLesson : lesson
      );
      
      await axios.put(`/api/courses/${selectedCourse._id}`, { lessons: updatedLessons });
      setLessons(updatedLessons);
      setEditingLesson(null);
      setNewLesson({ title: '', content: '', videoUrl: '', duration: '' });
      alert('Lesson updated successfully');
      
      const updatedCourses = courses.map(c => 
        c._id === selectedCourse._id 
          ? { ...c, lessons: updatedLessons }
          : c
      );
      setCourses(updatedCourses);
    } catch (error) {
      alert('Failed to update lesson');
    }
  };

  const deleteLesson = async (lessonIndex, lessonTitle) => {
    if (window.confirm(`Are you sure you want to delete "${lessonTitle}"?`)) {
      const updatedLessons = lessons.filter((_, index) => index !== lessonIndex);
      try {
        await axios.put(`/api/courses/${selectedCourse._id}`, { lessons: updatedLessons });
        setLessons(updatedLessons);
        alert('Lesson deleted successfully');
        
        const updatedCourses = courses.map(c => 
          c._id === selectedCourse._id 
            ? { ...c, lessons: updatedLessons }
            : c
        );
        setCourses(updatedCourses);
      } catch (error) {
        alert('Failed to delete lesson');
      }
    }
  };

  const startEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setNewLesson({
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl || '',
      duration: lesson.duration || ''
    });
  };

  const cancelEdit = () => {
    setEditingLesson(null);
    setNewLesson({ title: '', content: '', videoUrl: '', duration: '' });
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading dashboard...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👨‍🏫 Instructor Dashboard</h2>
        <Button as={Link} to="/instructor/courses/create" variant="primary" size="lg">
          + Create New Course
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center bg-primary text-white shadow">
            <Card.Body>
              <h1 className="display-4">{stats.totalCourses}</h1>
              <p>Total Courses</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center bg-success text-white shadow">
            <Card.Body>
              <h1 className="display-4">{stats.totalStudents}</h1>
              <p>Total Students Enrolled</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center bg-info text-white shadow">
            <Card.Body>
              <h1 className="display-4">${stats.totalRevenue}</h1>
              <p>Total Revenue</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* My Courses Section */}
      <h3 className="mb-3">📚 My Courses</h3>
      {courses.length === 0 ? (
        <Card className="text-center p-5">
          <p>You haven't created any courses yet.</p>
          <Button as={Link} to="/instructor/courses/create" variant="primary" className="mx-auto" style={{ width: '200px' }}>
            Create Your First Course
          </Button>
        </Card>
      ) : (
        <>
          <Table responsive striped bordered hover>
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>Course Title</th>
                <th>Category</th>
                <th>Level</th>
                <th>Price</th>
                <th>Students</th>
                <th>Lessons</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={course._id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{course.title}</strong>
                    {course.lessons?.length > 0 && (
                      <>
                        <br />
                        <small className="text-muted">{course.lessons.length} lessons</small>
                      </>
                    )}
                  </td>
                  <td>{course.category}</td>
                  <td>{course.level}</td>
                  <td>${course.price || 0}</td>
                  <td>{course.enrolledStudents?.length || 0}</td>
                  <td>
                    <span className="badge bg-info">
                      📚 {course.lessons?.length || 0} Lessons
                    </span>
                  </td>
                  <td>
                    {/* Edit Course Button */}
                    <Button 
                      as={Link} 
                      to={`/instructor/courses/${course._id}/edit`} 
                      variant="warning" 
                      size="sm" 
                      className="me-2"
                      title="Edit Course Details"
                    >
                      ✏️ Edit
                    </Button>
                    
                    {/* Lessons Button - THIS IS THE BUTTON YOU NEED */}
                    <Button 
                      variant="success" 
                      size="sm" 
                      className="me-2"
                      onClick={() => openLessonManager(course)}
                      title="Manage Lessons"
                    >
                      📚 Lessons
                    </Button>
                    
                    {/* Delete Course Button */}
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDeleteCourse(course._id, course.title)}
                      title="Delete Course"
                    >
                      🗑️ Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {/* Lesson Management Modal */}
      <Modal show={showLessonModal} onHide={() => {
        setShowLessonModal(false);
        setSelectedCourse(null);
        setNewLesson({ title: '', content: '', videoUrl: '', duration: '' });
        setEditingLesson(null);
      }} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            📚 Manage Lessons - {selectedCourse?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add/Edit Lesson Form */}
          <Card className="mb-4 bg-light">
            <Card.Body>
              <h5>{editingLesson ? '✏️ Edit Lesson' : '➕ Add New Lesson'}</h5>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-2">
                    <Form.Label>Lesson Title *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={newLesson.title}
                      onChange={handleLessonChange}
                      placeholder="e.g., Introduction to Web Development"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Duration</Form.Label>
                    <Form.Control
                      type="text"
                      name="duration"
                      value={newLesson.duration}
                      onChange={handleLessonChange}
                      placeholder="e.g., 15:30"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-2">
                <Form.Label>Lesson Content *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="content"
                  value={newLesson.content}
                  onChange={handleLessonChange}
                  placeholder="Enter lesson description or content..."
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Video URL (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="videoUrl"
                  value={newLesson.videoUrl}
                  onChange={handleLessonChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </Form.Group>
              <div className="d-flex gap-2 mt-2">
                {editingLesson ? (
                  <>
                    <Button variant="primary" onClick={updateLesson}>
                      💾 Update Lesson
                    </Button>
                    <Button variant="secondary" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="success" onClick={addLesson}>
                    + Add Lesson
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Lessons List */}
          <h5>📖 Course Lessons ({lessons.length})</h5>
          {lessons.length === 0 ? (
            <div className="text-center py-4 text-muted border rounded">
              <p>No lessons added yet. Add your first lesson above!</p>
            </div>
          ) : (
            <div className="lessons-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {lessons.map((lesson, index) => (
                <Card key={index} className="mb-2">
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-1">
                          <span className="badge bg-primary me-2">{index + 1}</span>
                          <h6 className="mb-0">{lesson.title}</h6>
                          {lesson.duration && (
                            <span className="badge bg-secondary ms-2">⏱️ {lesson.duration}</span>
                          )}
                        </div>
                        <p className="text-muted small mb-1">{lesson.content}</p>
                        {lesson.videoUrl && (
                          <div className="mt-1">
                            <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="small">
                              🎥 Watch Video
                            </a>
                          </div>
                        )}
                      </div>
                      <div>
                        <Button 
                          variant="outline-warning" 
                          size="sm" 
                          className="me-2"
                          onClick={() => startEditLesson(lesson)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => deleteLesson(index, lesson.title)}
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowLessonModal(false);
            setEditingLesson(null);
            setNewLesson({ title: '', content: '', videoUrl: '', duration: '' });
          }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default InstructorDashboard;