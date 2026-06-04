import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <Card className="course-card">
      <Card.Img variant="top" src={course.thumbnail || 'https://via.placeholder.com/300x200?text=Course'} />
      <Card.Body>
        <Card.Title>{course.title}</Card.Title>
        <Card.Text className="text-muted">
          {course.description?.substring(0, 100)}...
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <span className="badge bg-primary">{course.category}</span>
          <span className="fw-bold text-success">${course.price || 0}</span>
        </div>
        <Button as={Link} to={`/courses/${course._id}`} variant="primary" className="w-100 mt-3">
          View Course
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;