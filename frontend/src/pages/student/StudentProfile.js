import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const StudentProfile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
    location: '',
    occupation: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setProfile({
        name: response.data.data.name || '',
        email: response.data.data.email || '',
        bio: response.data.data.bio || '',
        phone: response.data.data.phone || '',
        location: response.data.data.location || '',
        occupation: response.data.data.occupation || '',
        profilePicture: response.data.data.profilePicture || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'danger', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.put(`/api/users/${user._id}`, profile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Refresh user data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading profile...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={4}>
          {/* Profile Card */}
          <Card className="shadow-sm mb-4">
            <Card.Body className="text-center">
              <div className="mb-3">
                {profile.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt={profile.name}
                    className="rounded-circle"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
                    style={{ width: '120px', height: '120px', fontSize: '48px' }}
                  >
                    {profile.name?.charAt(0) || '👤'}
                  </div>
                )}
              </div>
              <h4>{profile.name}</h4>
              <p className="text-muted mb-2">{profile.email}</p>
              <p className="badge bg-primary">Student</p>
              <hr />
              <Button variant="outline-danger" onClick={logout} className="w-100">
                Logout
              </Button>
            </Card.Body>
          </Card>

          {/* Stats Card */}
          <Card className="shadow-sm">
            <Card.Body>
              <h6 className="mb-3">Account Statistics</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Member Since:</span>
                <strong>{new Date(user?.createdAt).toLocaleDateString()}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Account Status:</span>
                <strong className="text-success">Active</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Account Type:</span>
                <strong>Student</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          {/* Edit Profile Form */}
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="mb-4">Edit Profile</h3>
              {message.text && (
                <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
                  {message.text}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        required
                        disabled
                      />
                      <Form.Text className="text-muted">
                        Email cannot be changed
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        placeholder="+92 300 1234567"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleChange}
                        placeholder="City, Country"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Occupation</Form.Label>
                  <Form.Control
                    type="text"
                    name="occupation"
                    value={profile.occupation}
                    onChange={handleChange}
                    placeholder="e.g., Student, Software Engineer, etc."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself, your interests, and learning goals..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Profile Picture URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="profilePicture"
                    value={profile.profilePicture}
                    onChange={handleChange}
                    placeholder="https://example.com/your-photo.jpg"
                  />
                  <Form.Text className="text-muted">
                    Enter a valid image URL for your profile picture
                  </Form.Text>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="secondary" onClick={fetchProfile}>
                    Reset
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentProfile;