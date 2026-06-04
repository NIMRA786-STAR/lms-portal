import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner, Modal, Table, ProgressBar } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
    duration: '',
    level: '',
    thumbnail: ''
  });
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({ title: '', content: '', videoUrl: '', duration: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [courseAnalytics, setCourseAnalytics] = useState(null);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  useEffect(() => {
    fetchCourse();
    fetchEnrolledStudents();
    fetchCourseAnalytics();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/api/courses/${id}`);
      const course = response.data.data;
      setFormData({
        title: course.title,
        description: course.description,
        category: course.category,
        price: course.price,
        duration: course.duration,
        level: course.level,
        thumbnail: course.thumbnail || ''
      });
      setLessons(course.lessons || []);
    } catch (error) {
      setError('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledStudents = async () => {
    try {
      const response = await axios.get(`/api/courses/${id}/students`);
      setEnrolledStudents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
    }
  };

  const fetchCourseAnalytics = async () => {
    try {
      const response = await axios.get('/api/courses/analytics/instructor');
      const courseData = response.data.courses.find(c => c._id === id);
      setCourseAnalytics(courseData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      const response = await axios.post(`/api/courses/${id}/lessons`, newLesson);
      setLessons(response.data.data.lessons);
      setNewLesson({ title: '', content: '', videoUrl: '', duration: '' });
      alert('Lesson added successfully');
      setShowLessonModal(false);
      fetchCourseAnalytics(); // Refresh analytics
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add lesson');
    }
  };

  const updateLesson = async () => {
    try {
      const updatedLessons = lessons.map(lesson =>
        lesson._id === editingLesson._id ? editingLesson : lesson
      );
      
      await axios.put(`/api/courses/${id}`, { lessons: updatedLessons });
      setLessons(updatedLessons);
      setShowLessonModal(false);
      setEditingLesson(null);
      alert('Lesson updated successfully');
    } catch (error) {
      alert('Failed to update lesson');
    }
  };

  const deleteLesson = async (lessonIndex, lessonTitle) => {
    if (window.confirm(`Are you sure you want to delete "${lessonTitle}"?`)) {
      const updatedLessons = lessons.filter((_, index) => index !== lessonIndex);
      try {
        await axios.put(`/api/courses/${id}`, { lessons: updatedLessons });
        setLessons(updatedLessons);
        alert('Lesson deleted successfully');
        fetchCourseAnalytics();
      } catch (error) {
        alert('Failed to delete lesson');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await axios.put(`/api/courses/${id}`, formData);
      alert('Course updated successfully!');
      navigate('/instructor/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading course...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={7}>
          {/* Course Edit Form */}
          <Card className="shadow mb-4">
            <Card.Body className="p-4">
              <h2 className="mb-4">✏️ Edit Course</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select name="category" value={formData.category} onChange={handleChange}>
                        <option>Programming</option>
                        <option>Design</option>
                        <option>Business</option>
                        <option>Marketing</option>
                        <option>Data Science</option>
                        <option>Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Level</Form.Label>
                      <Form.Select name="level" value={formData.level} onChange={handleChange}>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price ($)</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Duration</Form.Label>
                      <Form.Control
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Thumbnail URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary" disabled={saving}>
                    {saving ? 'Saving...' : '💾 Save Changes'}
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/instructor/dashboard')}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Lessons List Section */}
          <Card className="shadow">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0">📚 Course Lessons</h3>
                <Button variant="success" onClick={() => setShowLessonModal(true)}>
                  + Add New Lesson
                </Button>
              </div>
              
              {lessons.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <p>📄 No lessons added yet. Click "Add New Lesson" to create your first lesson.</p>
                </div>
              ) : (
                <div className="lessons-list">
                  {lessons.map((lesson, index) => (
                    <Card key={index} className="mb-3 lesson-card">
                      <Card.Body className="p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <span className="badge bg-primary me-2">{index + 1}</span>
                              <h5 className="mb-0">{lesson.title}</h5>
                            </div>
                            <p className="text-muted small mb-1">{lesson.content}</p>
                            {lesson.videoUrl && (
                              <div className="video-link mt-1">
                                <span className="text-primary">🎥 Video: {lesson.videoUrl}</span>
                              </div>
                            )}
                            {lesson.duration && (
                              <small className="text-muted">⏱️ Duration: {lesson.duration}</small>
                            )}
                          </div>
                          <div>
                            <Button 
                              variant="outline-warning" 
                              size="sm" 
                              className="me-2"
                              onClick={() => {
                                setEditingLesson(lesson);
                                setShowLessonModal(true);
                              }}
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
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          {/* Course Stats Card */}
          <Card className="shadow mb-4">
            <Card.Body>
              <h4>📊 Course Statistics</h4>
              <hr />
              <div className="mb-3">
                <strong>📚 Total Lessons:</strong> {lessons.length}
              </div>
              <div className="mb-3">
                <strong>👥 Enrolled Students:</strong> {enrolledStudents.length}
              </div>
              <div className="mb-3">
                <strong>💰 Total Revenue:</strong> ${(formData.price * enrolledStudents.length).toFixed(2)}
              </div>
              <div className="mb-3">
                <strong>✅ Course Status:</strong> 
                <span className="badge bg-success ms-2">Active</span>
              </div>
              <Button 
                variant="info" 
                className="w-100 mb-2"
                onClick={() => setShowStudentsModal(true)}
              >
                👥 View Enrolled Students ({enrolledStudents.length})
              </Button>
              <Button 
                variant="primary" 
                className="w-100"
                onClick={() => setShowAnalyticsModal(true)}
              >
                📈 View Analytics
              </Button>
            </Card.Body>
          </Card>

          {/* Quick Tips Card */}
          <Card className="shadow">
            <Card.Body>
              <h5>💡 Quick Tips</h5>
              <ul className="small">
                <li>Add engaging video content to increase student engagement</li>
                <li>Keep lessons concise and focused (5-15 minutes)</li>
                <li>Use high-quality thumbnails for better click-through rates</li>
                <li>Regularly update course content</li>
                <li>Respond to student questions promptly</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Lesson Modal */}
      <Modal show={showLessonModal} onHide={() => {
        setShowLessonModal(false);
        setEditingLesson(null);
        setNewLesson({ title: '', content: '', videoUrl: '', duration: '' });
      }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingLesson ? '✏️ Edit Lesson' : '📝 Add New Lesson'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Lesson Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editingLesson ? editingLesson.title : newLesson.title}
                onChange={(e) => {
                  if (editingLesson) {
                    setEditingLesson({ ...editingLesson, title: e.target.value });
                  } else {
                    setNewLesson({ ...newLesson, title: e.target.value });
                  }
                }}
                placeholder="e.g., Introduction to Web Development"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Lesson Content *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="content"
                value={editingLesson ? editingLesson.content : newLesson.content}
                onChange={(e) => {
                  if (editingLesson) {
                    setEditingLesson({ ...editingLesson, content: e.target.value });
                  } else {
                    setNewLesson({ ...newLesson, content: e.target.value });
                  }
                }}
                placeholder="Enter lesson description or content..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Video URL (Optional)</Form.Label>
              <Form.Control
                type="text"
                name="videoUrl"
                value={editingLesson ? editingLesson.videoUrl : newLesson.videoUrl}
                onChange={(e) => {
                  if (editingLesson) {
                    setEditingLesson({ ...editingLesson, videoUrl: e.target.value });
                  } else {
                    setNewLesson({ ...newLesson, videoUrl: e.target.value });
                  }
                }}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <Form.Text className="text-muted">
                Paste YouTube or Vimeo video URL
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duration (Optional)</Form.Label>
              <Form.Control
                type="text"
                name="duration"
                value={editingLesson ? editingLesson.duration : newLesson.duration}
                onChange={(e) => {
                  if (editingLesson) {
                    setEditingLesson({ ...editingLesson, duration: e.target.value });
                  } else {
                    setNewLesson({ ...newLesson, duration: e.target.value });
                  }
                }}
                placeholder="e.g., 15:30"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowLessonModal(false);
            setEditingLesson(null);
          }}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={editingLesson ? updateLesson : addLesson}
          >
            {editingLesson ? 'Update Lesson' : 'Add Lesson'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Enrolled Students Modal */}
      <Modal show={showStudentsModal} onHide={() => setShowStudentsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>👥 Enrolled Students - {formData.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {enrolledStudents.length === 0 ? (
            <div className="text-center py-4">
              <p>No students enrolled yet.</p>
            </div>
          ) : (
            <Table responsive striped hover>
              <thead className="bg-dark text-white">
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Enrolled Date</th>
                  <th>Progress</th>
                  <th>Lessons Done</th>
                </tr>
              </thead>
              <tbody>
                {enrolledStudents.map((student, index) => (
                  <tr key={student._id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        {student.profilePicture ? (
                          <img 
                            src={student.profilePicture} 
                            alt={student.name}
                            style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '8px' }}
                          />
                        ) : (
                          <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-2" 
                               style={{ width: '30px', height: '30px' }}>
                            {student.name?.charAt(0)}
                          </div>
                        )}
                        <span>{student.name}</span>
                      </div>
                    </td>
                    <td>{student.email}</td>
                    <td>{new Date(student.enrolledAt).toLocaleDateString()}</td>
                    <td style={{ width: '120px' }}>
                      <div className="d-flex align-items-center">
                        <ProgressBar 
                          now={student.progress || 0} 
                          variant={student.progress === 100 ? 'success' : 'primary'}
                          style={{ height: '6px', flex: 1 }}
                        />
                        <span className="ms-2 small">{student.progress || 0}%</span>
                      </div>
                    </td>
                    <td>{student.completedLessons || 0} / {student.totalLessons || 0}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStudentsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Course Analytics Modal */}
      <Modal show={showAnalyticsModal} onHide={() => setShowAnalyticsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📈 Course Analytics - {formData.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {courseAnalytics ? (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="bg-primary text-white text-center">
                    <Card.Body>
                      <h3>{enrolledStudents.length}</h3>
                      <p>Total Students</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="bg-success text-white text-center">
                    <Card.Body>
                      <h3>${(formData.price * enrolledStudents.length).toFixed(2)}</h3>
                      <p>Total Revenue</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <Card className="bg-info text-white text-center">
                    <Card.Body>
                      <h3>{lessons.length}</h3>
                      <p>Total Lessons</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="bg-warning text-white text-center">
                    <Card.Body>
                      <h3>{courseAnalytics.completionRate || 0}%</h3>
                      <p>Completion Rate</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <h5>Student Progress Distribution</h5>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>0-25%</span>
                  <span>{enrolledStudents.filter(s => s.progress < 25).length} students</span>
                </div>
                <ProgressBar now={enrolledStudents.filter(s => s.progress < 25).length / (enrolledStudents.length || 1) * 100} variant="danger" />
                
                <div className="d-flex justify-content-between mt-2 mb-1">
                  <span>25-50%</span>
                  <span>{enrolledStudents.filter(s => s.progress >= 25 && s.progress < 50).length} students</span>
                </div>
                <ProgressBar now={enrolledStudents.filter(s => s.progress >= 25 && s.progress < 50).length / (enrolledStudents.length || 1) * 100} variant="warning" />
                
                <div className="d-flex justify-content-between mt-2 mb-1">
                  <span>50-75%</span>
                  <span>{enrolledStudents.filter(s => s.progress >= 50 && s.progress < 75).length} students</span>
                </div>
                <ProgressBar now={enrolledStudents.filter(s => s.progress >= 50 && s.progress < 75).length / (enrolledStudents.length || 1) * 100} variant="info" />
                
                <div className="d-flex justify-content-between mt-2 mb-1">
                  <span>75-99%</span>
                  <span>{enrolledStudents.filter(s => s.progress >= 75 && s.progress < 100).length} students</span>
                </div>
                <ProgressBar now={enrolledStudents.filter(s => s.progress >= 75 && s.progress < 100).length / (enrolledStudents.length || 1) * 100} variant="primary" />
                
                <div className="d-flex justify-content-between mt-2 mb-1">
                  <span>100% (Completed)</span>
                  <span>{enrolledStudents.filter(s => s.progress === 100).length} students</span>
                </div>
                <ProgressBar now={enrolledStudents.filter(s => s.progress === 100).length / (enrolledStudents.length || 1) * 100} variant="success" />
              </div>

              <h5>Recent Enrollments</h5>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Date</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {enrolledStudents.slice(0, 5).map((student, idx) => (
                    <tr key={idx}>
                      <td>{student.name}</td>
                      <td>{new Date(student.enrolledAt).toLocaleDateString()}</td>
                      <td>{student.progress}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            <p>No analytics data available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAnalyticsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EditCourse;