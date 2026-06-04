import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const Home = () => {
  return (
    <>
      <div className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1>Learn Anywhere, Anytime</h1>
              <p className="lead">
                Master new skills with our comprehensive online courses taught by industry experts.
              </p>
              <Button as={Link} to="/courses" variant="light" size="lg">
                Explore Courses
              </Button>
            </Col>
            <Col md={6} className="text-center">
              <img src="https://www.billabonghighschool.com/images/blog/Allroundeducation-min2.jpg" alt="Learning" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </div>
      
      <Container className="my-5">
        <h2 className="text-center mb-4">Why Choose Us?</h2>
        <Row>
          <Col md={4}>
            <div className="stat-card">
              <h3>100+</h3>
              <p>Expert Instructors</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="stat-card">
              <h3>500+</h3>
              <p>Online Courses</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="stat-card">
              <h3>10,000+</h3>
              <p>Happy Students</p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
