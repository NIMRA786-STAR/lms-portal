import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourse();
    if (user) checkEnrollment();
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/api/courses/${id}`);
      setCourse(response.data.data);
    } catch (error) {
      setError('Course not found');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await axios.get('/api/enroll/my-courses');
      const enrolled = response.data.data.some(e => e.course._id === id);
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      alert('Only students can enroll in courses');
      return;
    }

    setEnrolling(true);
    try {
      await axios.post('/api/enroll', { courseId: id });
      setIsEnrolled(true);
      alert('Successfully enrolled in course!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading course details...</p>
      </Container>
    );
  }

  if (error || !course) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'Course not found'}</Alert>
        <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={8}>
          <h1>{course.title}</h1>
          <p className="text-muted">
            By {course.instructor?.name || 'Unknown Instructor'} | {course.category} | {course.level}
          </p>
          
          <img 
            src={course.thumbnail || 'https://via.placeholder.com/800x400?text=Course'} 
            alt={course.title}
            className="img-fluid rounded mb-4"
          />
          
          <h3>Description</h3>
          <p>{course.description}</p>
          
          <h3>Course Content</h3>
          <ListGroup className="mb-4">
            {course.lessons && course.lessons.length > 0 ? (
              course.lessons.map((lesson, index) => (
                <ListGroup.Item key={index}>
                  <strong>Lesson {index + 1}:</strong> {lesson.title}
                  <br />
                  <small className="text-muted">Duration: {lesson.duration}</small>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No lessons available yet</ListGroup.Item>
            )}
          </ListGroup>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="text-primary">${course.price || 0}</h3>
              <p className="text-muted">Duration: {course.duration || '4 weeks'}</p>
              <hr />
              <Button 
                variant={isEnrolled ? 'success' : 'primary'} 
                className="w-100 mb-2"
                onClick={handleEnroll}
                disabled={enrolling || isEnrolled}
              >
                {enrolling ? 'Enrolling...' : isEnrolled ? 'Already Enrolled' : 'Enroll Now'}
              </Button>
              <Button variant="outline-secondary" className="w-100" onClick={() => navigate('/courses')}>
                Back to Courses
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseDetail;