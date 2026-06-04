import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center bg-primary text-white">
            <Card.Body>
              <h1>{stats?.users?.total || 0}</h1>
              <p>Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-success text-white">
            <Card.Body>
              <h1>{stats?.users?.students || 0}</h1>
              <p>Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-info text-white">
            <Card.Body>
              <h1>{stats?.users?.instructors || 0}</h1>
              <p>Instructors</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-warning text-white">
            <Card.Body>
              <h1>{stats?.courses?.total || 0}</h1>
              <p>Total Courses</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <h4>Quick Actions</h4>
              <hr />
              <div className="d-grid gap-2">
                <Link to="/admin/users" className="btn btn-outline-primary">
                  Manage Users
                </Link>
                <Link to="/courses" className="btn btn-outline-success">
                  Manage Courses
                </Link>
                <Link to="/admin/analytics" className="btn btn-outline-info">
                  View Analytics
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <h4>Recent Activity</h4>
              <hr />
              <p><strong>New Users (30 days):</strong> {stats?.users?.newLast30Days || 0}</p>
              <p><strong>New Courses (30 days):</strong> {stats?.courses?.newLast30Days || 0}</p>
              <p><strong>Total Enrollments:</strong> {stats?.enrollments?.total || 0}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h3 className="mb-3">Popular Courses</h3>
      <Row>
        {stats?.popularCourses?.map((course, index) => (
          <Col key={course._id} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <h5>{index + 1}. {course.title}</h5>
                <p className="text-muted">{course.enrolledStudents?.length || 0} students enrolled</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminDashboard;