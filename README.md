# 📚 Learning Management System (LMS Portal)

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![MERN](https://img.shields.io/badge/MERN-Full%20Stack-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-brightgreen)
![License](https://img.shields.io/badge/license-MIT-orange)

## 🚀 Live Demo

[Live Demo URL - Add your deployed link here]

## 📖 Project Overview

A complete **Full Stack Learning Management System** built with the MERN (MongoDB, Express.js, React, Node.js) stack. This platform enables seamless online learning with three distinct user roles: **Admin**, **Instructor**, and **Student**.

### 🎯 Key Features

| Role | Features |
|------|----------|
| **👑 Admin** | Manage all users, view system analytics, manage all courses, user statistics |
| **👨‍🏫 Instructor** | Create/Edit/Delete courses, upload lessons, view enrolled students, track analytics |
| **👨‍🎓 Student** | Browse courses, enroll in courses, track learning progress, view enrolled courses |

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- Password hashing with Bcrypt
- Role-based access control (RBAC)
- Protected routes and API endpoints

### 📚 Course Management
- Create, Read, Update, Delete courses
- Upload video lessons with titles and descriptions
- Categorize courses (Programming, Design, Business, etc.)
- Set course levels (Beginner, Intermediate, Advanced)
- Add course thumbnails and pricing

### 👥 User Management
- User registration with role selection
- Profile management (update name, bio, profile picture)
- Admin panel to manage all users
- Student enrollment tracking

### 📊 Analytics & Reporting
- Instructor dashboard with course statistics
- Student progress tracking
- Revenue analytics for instructors
- System-wide analytics for admin

### 📱 Responsive Design
- Fully responsive UI with React Bootstrap
- Mobile-friendly navigation
- Adaptive layouts for all screen sizes

## 🛠️ Technologies Used

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| React Router v6 | Navigation |
| React Bootstrap | UI components |
| Axios | API calls |
| CSS3 | Custom styling |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Bcryptjs | Password hashing |

### Development Tools
- Nodemon (auto-restart during development)
- Postman (API testing)
- Git (version control)


## 🚀 Installation & Setup

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v6 or higher)
- [Git](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/NIMRA786-STAR/lms-portal.git
cd lms-portal

Step 2: Backend Setup
bash
cd backend
npm install

Create a .env file

Start the backend server:

bash
npm run dev
Step 3: Frontend Setup
Open a new terminal and navigate to the frontend folder:

bash
cd frontend
npm install
Start the frontend development server:

bash
npm start
Step 4: Access the Application
Frontend: http://localhost:3000

Backend API: http://localhost:5000

👥 Demo Accounts
Role	Email	Password
Admin	admin@lms.com	admin123
Instructor	instructor@lms.com	instructor123
Student	student@lms.com	student123

🔌 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	User registration
POST	/api/auth/login	User login
GET	/api/auth/me	Get current user
Courses
Method	Endpoint	Description
GET	/api/courses	Get all courses
GET	/api/courses/:id	Get course by ID
POST	/api/courses	Create new course
PUT	/api/courses/:id	Update course
DELETE	/api/courses/:id	Delete course
Enrollment
Method	Endpoint	Description
POST	/api/enroll	Enroll in course
GET	/api/enroll/my-courses	Get enrolled courses
PUT	/api/enroll/progress/:id	Update progress
DELETE	/api/enroll/:id	Drop course
🎯 Learning Outcomes
This project demonstrates:

✅ Complete MERN stack development

✅ RESTful API design and implementation

✅ JWT authentication and authorization

✅ Role-based access control (RBAC)

✅ CRUD operations with MongoDB

✅ React hooks (useState, useEffect, useContext)

✅ Protected routes in React

✅ Responsive UI design with Bootstrap

✅ Environment variable configuration

✅ Industry-standard project structure

🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👩‍💻 Author
Nimra Farid

GitHub: @NIMRA786-STAR

Student ID: HM-2025-1016-454

Course: MERN Stack Web Development

🙏 Acknowledgments
React JS Documentation

Node.js Documentation

MongoDB University

Bootstrap for UI components

## 📁 Project Structure

