import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    completedCourses: 0,
    averageProgress: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch enrolled courses
      const enrolledRes = await axios.get('/api/enroll/my-courses');
      const enrollments = enrolledRes.data.data;
      setEnrolledCourses(enrollments);

      // Calculate stats
      const completed = enrollments.filter(e => e.progress === 100).length;
      const avgProgress = enrollments.length > 0 
        ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length)
        : 0;

      setStats({
        totalEnrolled: enrollments.length,
        completedCourses: completed,
        averageProgress: avgProgress
      });

      // Fetch recommended courses (exclude enrolled ones)
      const coursesRes = await axios.get('/api/courses');
      const enrolledIds = enrollments.map(e => e.course?._id);
      const recommended = coursesRes.data.data
        .filter(c => !enrolledIds.includes(c._id))
        .slice(0, 3);
      setRecommendedCourses(recommended);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        // Redirect to login if unauthorized
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading dashboard...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Welcome back, {user?.name}! 👋</h2>
       
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center bg-primary text-white shadow-sm">
            <Card.Body>
              <h1 className="display-4">{stats.totalEnrolled}</h1>
              <p className="mb-0">Enrolled Courses</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center bg-success text-white shadow-sm">
            <Card.Body>
              <h1 className="display-4">{stats.completedCourses}</h1>
              <p className="mb-0">Completed Courses</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center bg-info text-white shadow-sm">
            <Card.Body>
              <h1 className="display-4">{stats.averageProgress}%</h1>
              <p className="mb-0">Average Progress</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* My Enrolled Courses Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>My Enrolled Courses</h3>
        <Button as={Link} to="/my-courses" variant="outline-primary" size="sm">
          View All →
        </Button>
      </div>

      {enrolledCourses.length === 0 ? (
        <Card className="text-center p-5 bg-light">
          <div className="py-4">
            <h4>No courses enrolled yet</h4>
            <p className="text-muted">Browse our course catalog and start learning today!</p>
            <Button as={Link} to="/courses" variant="primary">
              Browse Courses
            </Button>
          </div>
        </Card>
      ) : (
        <Row>
          {enrolledCourses.slice(0, 3).map((enrollment) => (
            <Col key={enrollment._id} md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{enrollment.course?.title || 'Untitled Course'}</Card.Title>
                  <Card.Text className="text-muted small">
                    Instructor: {enrollment.course?.instructor?.name || 'Unknown'}
                  </Card.Text>
                  <div className="mb-2">
                    <small className="text-muted">Progress: {enrollment.progress || 0}%</small>
                    <ProgressBar 
                      now={enrollment.progress || 0} 
                      variant={enrollment.progress === 100 ? 'success' : 'primary'}
                      className="mt-1"
                      style={{ height: '8px' }}
                    />
                  </div>
                  <Button 
                    as={Link} 
                    to={`/courses/${enrollment.course?._id}`} 
                    variant="primary" 
                    size="sm"
                    className="mt-2 w-100"
                  >
                    {enrollment.progress === 100 ? 'Review Course' : 'Continue Learning'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Recommended Courses Section */}
      {recommendedCourses.length > 0 && (
        <>
          <h3 className="mb-3 mt-4">Recommended for You</h3>
          <Row>
            {recommendedCourses.map((course) => (
              <Col key={course._id} md={4} className="mb-4">
                <Card className="course-card">
                  <Card.Img 
                    variant="top" 
                    src={course.thumbnail || 'https://via.placeholder.com/300x150?text=Course'} 
                   style={{ height: '150px', objectFit: 'cover' }}

                  />
                  <Card.Body>
                    <Card.Title>{course.title}</Card.Title>
                    <Card.Text className="text-muted small">
                      {course.description?.substring(0, 80)}...
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-secondary">{course.category}</span>
                      <span className="text-primary fw-bold">${course.price || 0}</span>
                    </div>
                    <Button 
                      as={Link} 
                      to={`/courses/${course._id}`} 
                      variant="outline-primary" 
                      size="sm"
                      className="mt-3 w-100"
                    >
                      View Course
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default StudentDashboard;