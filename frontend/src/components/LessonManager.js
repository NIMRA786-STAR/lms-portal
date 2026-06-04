import React, { useState } from 'react';
import { Modal, Button, Form, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const LessonManager = ({ show, onHide, course, onLessonsUpdate }) => {
  const [lessons, setLessons] = useState(course?.lessons || []);
  const [newLesson, setNewLesson] = useState({ title: '', content: '', videoUrl: '', duration: '' });
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      const response = await axios.post(`/api/courses/${course._id}/lessons`, newLesson);
      setLessons(response.data.data.lessons);
      setNewLesson({ title: '', content: '', videoUrl: '', duration: '' });
      alert('Lesson added successfully');
      if (onLessonsUpdate) onLessonsUpdate(response.data.data.lessons);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add lesson');
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (lessonIndex, lessonTitle) => {
    if (window.confirm(`Are you sure you want to delete "${lessonTitle}"?`)) {
      const updatedLessons = lessons.filter((_, index) => index !== lessonIndex);
      try {
        await axios.put(`/api/courses/${course._id}`, { lessons: updatedLessons });
        setLessons(updatedLessons);
        alert('Lesson deleted successfully');
        if (onLessonsUpdate) onLessonsUpdate(updatedLessons);
      } catch (error) {
        alert('Failed to delete lesson');
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>📚 Manage Lessons - {course?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Add Lesson Form */}
        <Card className="mb-4 bg-light">
          <Card.Body>
            <h5>➕ Add New Lesson</h5>
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
                placeholder="Enter lesson description..."
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
            <Button variant="success" onClick={addLesson} disabled={loading}>
              {loading ? 'Adding...' : '+ Add Lesson'}
            </Button>
          </Card.Body>
        </Card>

        {/* Lessons List */}
        <h5>📖 Course Lessons ({lessons.length})</h5>
        {lessons.length === 0 ? (
          <div className="text-center py-4 text-muted border rounded">
            <p>No lessons added yet. Add your first lesson above!</p>
          </div>
        ) : (
          lessons.map((lesson, index) => (
            <Card key={index} className="mb-2">
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between">
                  <div>
                    <span className="badge bg-primary me-2">{index + 1}</span>
                    <strong>{lesson.title}</strong>
                    {lesson.duration && (
                      <span className="badge bg-secondary ms-2">⏱️ {lesson.duration}</span>
                    )}
                    <p className="text-muted small mt-1 mb-0">{lesson.content}</p>
                    {lesson.videoUrl && (
                      <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="small">
                        🎥 Watch Video
                      </a>
                    )}
                  </div>
                  <Button variant="outline-danger" size="sm" onClick={() => deleteLesson(index, lesson.title)}>
                    🗑️ Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LessonManager;