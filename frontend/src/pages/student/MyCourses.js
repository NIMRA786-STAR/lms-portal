import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, ProgressBar, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/enroll/my-courses');
      setEnrollments(response.data.data);
    } catch (error) {
      console.error('Error fetching my courses:', error);
      setError(error.response?.data?.message || 'Failed to load your courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDropCourse = async (enrollmentId, courseTitle) => {
    if (window.confirm(`Are you sure you want to drop "${courseTitle}"? You will lose all progress.`)) {
      try {
        await axios.delete(`/api/enroll/${enrollmentId}`);
        alert('Course dropped successfully');
        fetchMyCourses(); // Refresh the list
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to drop course');
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your courses...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => fetchMyCourses()} variant="primary">
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">My Courses</h2>
      
      {enrollments.length === 0 ? (
        <Card className="text-center p-5 bg-light">
          <div className="py-4">
            <h4>📚 No courses enrolled yet</h4>
            <p className="text-muted">You haven't enrolled in any courses. Browse our catalog to get started!</p>
            <Button as={Link} to="/courses" variant="primary" size="lg">
              Browse Courses
            </Button>
          </div>
        </Card>
      ) : (
        <Row>
          {enrollments.map((enrollment) => (
            <Col key={enrollment._id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <Card.Title className="mb-2">{enrollment.course?.title || 'Untitled Course'}</Card.Title>
                    <span className={`badge ${enrollment.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                      {enrollment.status || 'active'}
                    </span>
                  </div>
                  
                  <Card.Text className="text-muted small mb-2">
                    <strong>Instructor:</strong> {enrollment.course?.instructor?.name || 'Unknown'}
                  </Card.Text>
                  
                  <Card.Text className="small">
                    {enrollment.course?.description?.substring(0, 100)}...
                  </Card.Text>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-muted">Progress</small>
                      <small className="text-primary fw-bold">{enrollment.progress || 0}%</small>
                    </div>
                    <ProgressBar 
                      now={enrollment.progress || 0} 
                      variant={enrollment.progress === 100 ? 'success' : 'primary'}
                      style={{ height: '8px' }}
                    />
                  </div>
                  
                  <div className="d-flex gap-2 mt-3">
                    <Button 
                      as={Link} 
                      to={`/courses/${enrollment.course?._id}`} 
                      variant="primary" 
                      size="sm"
                      className="flex-grow-1"
                    >
                      {enrollment.progress === 100 ? 'Review Course' : 'Continue Learning'}
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDropCourse(enrollment._id, enrollment.course?.title)}
                    >
                      Drop
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyCourses;