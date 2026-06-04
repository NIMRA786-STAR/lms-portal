import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>📚 Learning Management System</h5>
            <p className="text-muted small">
              Empowering education through technology. Learn anytime, anywhere with our expert-led courses.
            </p>
          </Col>
          
          <Col md={2} className="mb-3 mb-md-0">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-muted text-decoration-none small">Home</Link></li>
              <li><Link to="/courses" className="text-muted text-decoration-none small">Courses</Link></li>
              <li><Link to="/about" className="text-muted text-decoration-none small">About Us</Link></li>
            </ul>
          </Col>
          
          <Col md={3} className="mb-3 mb-md-0">
            <h6>Support</h6>
            <ul className="list-unstyled">
              <li><Link to="/faq" className="text-muted text-decoration-none small">FAQ</Link></li>
              <li><Link to="/contact" className="text-muted text-decoration-none small">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-muted text-decoration-none small">Privacy Policy</Link></li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h6>Connect With Us</h6>
            <div className="d-flex gap-3">
              <a href="#" className="text-muted text-decoration-none">📘 Facebook</a>
              <a href="#" className="text-muted text-decoration-none">🐦 Twitter</a>
              <a href="#" className="text-muted text-decoration-none">📸 Instagram</a>
              <a href="#" className="text-muted text-decoration-none">💼 LinkedIn</a>
            </div>
            <p className="mt-2 text-muted small">
              📧 support@lms.com<br />
              📞 +1 234 567 890
            </p>
          </Col>
        </Row>
        
        <hr className="bg-secondary" />
        
        <div className="text-center text-muted small">
          &copy; {currentYear} Learning Management System. All rights reserved.
          <br />
          Developed by Nimra Farid | Student ID: HM-2025-1016-454
        </div>
      </Container>
    </footer>
  );
};

export default Footer;