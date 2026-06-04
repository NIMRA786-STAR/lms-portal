import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Card, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, selectedCategory, selectedLevel]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedLevel) params.level = selectedLevel;

      const response = await axios.get('/api/courses', { params });
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLevel('');
  };

  const categories = ['All', 'Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Other'];
  const levels = ['', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Explore Courses</h1>
      
      {/* Search and Filter Section */}
     <Card className="mb-4 shadow-sm"> 
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row>
              <Col md={5} className="mb-3">
                <Form.Group>
                  <Form.Label>Search Courses</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search by title or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button type="submit" variant="primary">
                      Search
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Level</Form.Label>
                  <Form.Select 
                    value={selectedLevel} 
                    onChange={(e) => setSelectedLevel(e.target.value)}
                  >
                    {levels.map(lvl => (
                      <option key={lvl || 'all'} value={lvl}>{lvl || 'All Levels'}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={1} className="mb-3 d-flex align-items-end">
                <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
                  Clear
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Results Count */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="text-muted mb-0">Found {courses.length} courses</p>
        {loading && <Spinner animation="border" variant="primary" size="sm" />}
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <Card className="text-center p-5 bg-light">
          <div className="py-4">
            <h4>🔍 No courses found</h4>
            <p className="text-muted">Try adjusting your search or filter criteria.</p>
            <Button variant="outline-primary" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        </Card>
      ) : (
        <Row>
          {courses.map(course => (
            <Col key={course._id} md={6} lg={4} className="mb-4">
             <Card className="h-100 shadow-sm course-card"> 
             
                <Card.Img 
                  variant="top" 
                  src={course.thumbnail || 'https://via.placeholder.com/300x180?text=Course'} 
                  style={{ height: '180px', objectFit: 'cover' }} 
                />
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0">{course.title}</Card.Title>
                    <span className="badge bg-primary">{course.category}</span>
                  </div>
                  <Card.Text className="text-muted small mb-2">
                    <strong>Instructor:</strong> {course.instructor?.name || 'Unknown'}
                  </Card.Text>
                  <Card.Text className="small">
                    {course.description?.substring(0, 100)}...
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="text-primary fw-bold h5 mb-0">${course.price || 0}</span>
                    <span className="badge bg-secondary">{course.level || 'Beginner'}</span>
                  </div>
                  <Button 
                    as={Link} 
                    to={`/courses/${course._id}`} 
                    variant="primary" 
                    className="w-100 mt-3"
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Courses;