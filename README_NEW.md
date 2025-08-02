# 🎓 Course Management Platform API

> A comprehensive Node.js backend service for academic institutions, empowering faculty operations, student progress monitoring, and seamless academic coordination.

[![Node.js](https://img.shields.io/badge/Node.js-16.x+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-orange.svg)](https://mysql.com/)
[![Redis](https://img.shields.io/badge/Redis-6.x-red.svg)](https://redis.io/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com/)

## 🚀 Live Demo & Resources

| Resource | Link | Status |
|----------|------|--------|
| 🎥 **Video Demo** | [YouTube Walkthrough](https://youtu.be/NY2bDVUtBdM) | ✅ Live |
| 🌐 **Student Reflection Page** | [reflection-page.netlify.app](https://reflection-page.netlify.app/) | ✅ Live |
| 📖 **API Documentation** | [Postman Collection](./Course%20Management%20system.postman_collection.json) | 📄 Available |
| ☁️ **API Deployment** | [Vercel Platform](https://vercel.com/) | 🚀 Ready |

---

## ✨ Key Features

### 🏗️ **Module 1: Intelligent Course Allocation**
- 📋 **Manager Controls**: Full CRUD operations for course allocations
- 👨‍🏫 **Facilitator View**: Access only to assigned courses
- 🔍 **Smart Filtering**: Filter by cohort, trimester, intake, mode, and facilitator
- 📊 **Real-time Analytics**: Track allocation metrics and trends

### 📈 **Module 2: Facilitator Activity Tracker (FAT)**
- 📝 **Weekly Submissions**: Structured activity log submissions
- 🔔 **Smart Notifications**: Redis-powered reminder system
- 👔 **Manager Dashboard**: Comprehensive monitoring and alert system
- 📧 **Email Integration**: Automated compliance notifications

### 🌍 **Module 3: Multilingual Student Reflection**
- 🗣️ **i18n Support**: English ⇄ French language switching
- 🎨 **Modern UI**: Responsive design with smooth transitions
- ☁️ **Cloud Hosted**: Deployed on Netlify for global accessibility

---

## 🛠️ Technology Stack

<div align="center">

| **Backend** | **Database** | **DevOps** | **Frontend** |
|-------------|--------------|------------|--------------|
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white) | ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) | ![Vercel](https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel&logoColor=white) | ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) |
| ![Express.js](https://img.shields.io/badge/-Express.js-000000?style=flat-square&logo=express&logoColor=white) | ![Redis](https://img.shields.io/badge/-Redis-DC382D?style=flat-square&logo=redis&logoColor=white) | ![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github&logoColor=white) | ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) |
| ![JWT](https://img.shields.io/badge/-JWT-000000?style=flat-square&logo=json-web-tokens&logoColor=white) | ![Sequelize](https://img.shields.io/badge/-Sequelize-52B0E7?style=flat-square&logo=sequelize&logoColor=white) | ![Nodemailer](https://img.shields.io/badge/-Nodemailer-339933?style=flat-square&logo=nodemailer&logoColor=white) | ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |

</div>

---

## 🚀 Quick Start Guide

### 📋 Prerequisites
- Node.js 16+ 
- MySQL 8+
- Redis Server
- Git

### ⚡ Installation

```bash
# Clone the repository
git clone https://github.com/Lydia02/LMS-Backend.git
cd LMS-Backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration
```

### 🔧 Environment Configuration

Create a `.env` file in the root directory:

```env
# 🗄️ Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASS=your_mysql_password
DB_NAME=Summative_API
DB_PORT=3306

# 🔴 Redis Configuration
REDIS_URL=redis://127.0.0.1:6379

# 🔐 Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development

# 🌐 Server Configuration
PORT=3000

# 📧 Email Notifications
NODEMAILER_HOST=smtp.gmail.com
NODEMAILER_EMAIL=your-email@gmail.com
NODEMAILER_PASS=your-app-password
```

### 🎯 Database Setup

```bash
# Create database
npx sequelize-cli db:create

# Run migrations
npx sequelize-cli db:migrate

# (Optional) Seed sample data
npx sequelize-cli db:seed:all
```

### 🚀 Launch Application

```bash
# Development mode
npm run dev

# Production mode
npm start

# Run tests
npm test
```

---

## ☁️ Vercel Deployment

### 🔧 Setup for Vercel

1. **Create `vercel.json` configuration:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

2. **Deploy to Vercel:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or deploy via GitHub integration
# Connect your repo at vercel.com
```

3. **Configure Environment Variables:**
   - Go to your Vercel dashboard
   - Navigate to Project Settings → Environment Variables
   - Add all your `.env` variables

### 🌐 Production Considerations

- **Database**: Use a cloud MySQL service (PlanetScale, AWS RDS)
- **Redis**: Use Redis Cloud or Upstash
- **Monitoring**: Set up logging and error tracking
- **Security**: Update JWT secrets and enable CORS properly

---

## 📊 Database Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Manager   │───▶│ Allocation  │◀───│ Facilitator │
└─────────────┘    └─────────────┘    └─────────────┘
                           │
                           ▼
                   ┌─────────────┐    ┌─────────────┐
                   │ActivityLog  │───▶│ Notification│
                   └─────────────┘    └─────────────┘
                           │
                           ▼
                   ┌─────────────┐
                   │   Student   │
                   └─────────────┘
```

### 🗃️ Core Entities
- **👔 Manager**: System administrators and academic managers
- **👨‍🏫 Facilitator**: Course instructors and teachers  
- **👨‍🎓 Student**: Enrolled learners
- **📚 Module**: Course modules and subjects
- **🏫 Class**: Physical or virtual classroom sessions
- **💻 Mode**: Learning delivery methods (Online, In-Person, Hybrid)
- **📋 Allocation**: Course assignments and scheduling
- **📝 Activity Tracker**: Weekly progress logs
- **🔔 Notification**: System alerts and reminders

---

## 🔐 Authentication & Security

### 🎯 Role-Based Access Control

| Role | Permissions | Endpoints |
|------|-------------|-----------|
| **🔧 System Admin** | Full system access | All endpoints |
| **👔 Manager** | Allocation management, reporting | `/api/managers/*` |
| **👨‍🏫 Facilitator** | View assignments, submit logs | `/api/facilitators/*` |
| **👨‍🎓 Student** | Profile management, dashboard | `/api/students/*` |

### 🛡️ Security Features
- 🔒 **JWT Authentication**: Secure token-based auth
- 🔐 **Password Hashing**: bcrypt encryption
- 🚫 **Role Middleware**: Endpoint protection
- ⚡ **Rate Limiting**: API abuse prevention
- 🔍 **Input Validation**: Data sanitization

---

## 📖 API Documentation

### 🎯 Base URL
```
Production: https://your-app.vercel.app
Development: http://localhost:3000
```

### 📊 Endpoint Overview

| Category | Endpoints | Description |
|----------|-----------|-------------|
| 🔐 **Authentication** | 8 | User registration, login, approval |
| 👔 **Manager Operations** | 20 | Allocations, compliance, reporting |
| 👨‍🏫 **Facilitator Tools** | 10 | Course management, activity logs |
| 👨‍🎓 **Student Portal** | 4 | Profile, dashboard, progress |
| 👥 **Cohort Management** | 5 | Student group operations |
| ⚙️ **System Setup** | 6 | Modules, classes, modes configuration |

### 🚀 Quick Test Endpoints

```bash
# Health Check
curl http://localhost:3000/

# Authentication Test
curl -X POST http://localhost:3000/api/auth/system-admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"kkhotmachuil.com","password":"AdminPass343"}'
```

---

## 🔔 Redis Notification System

### ⚡ Real-time Features
- **📧 Email Reminders**: Automated facilitator notifications
- **🚨 Compliance Alerts**: Manager dashboard notifications  
- **📊 Queue Management**: Background job processing
- **⏰ Scheduled Tasks**: Weekly compliance checks

### 🛠️ Queue Operations
```javascript
// Add reminder to queue
await notificationQueue.add('facilitator-reminder', {
  facilitatorId: 'uuid',
  weekNumber: 3,
  email: 'facilitator@alu.edu'
});

// Process compliance check
await complianceQueue.add('manager-alert', {
  managerId: 'uuid',
  alertType: 'missing-submissions',
  weekNumber: 3
});
```

---

## 🧪 Testing Strategy

### 🎯 Test Coverage
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm run test:auth
npm run test:managers  
npm run test:facilitators
```

### 📊 Test Categories
- **🔐 Authentication Tests**: Login, registration, JWT validation
- **👔 Manager Tests**: Allocation CRUD, filtering, reporting
- **👨‍🏫 Facilitator Tests**: Activity logs, course access
- **📊 Integration Tests**: End-to-end API workflows
- **🔧 Utility Tests**: Helper functions, validation

---

## 📁 Project Structure

```
📦 Summative_API/
├── 🔧 config/                 # Database & Redis configuration
├── 🎮 controllers/            # Route handlers & business logic
├── 🛡️ middleware/             # Authentication & validation
├── 📊 migrations/             # Database schema migrations  
├── 🗃️ models/                 # Sequelize ORM models
├── 🛣️ routes/                 # Express route definitions
├── ⚙️ services/               # Business logic services
├── 🧪 tests/                  # Unit & integration tests
├── 🔧 utils/                  # Helper functions & utilities
├── 🌍 student-reflection-page/ # Multilingual frontend
├── 🔔 notification-system/    # Redis workers & scheduler
├── 📄 app.js                  # Express application setup
├── 🚀 server.js               # Application entry point
├── ☁️ vercel.json             # Vercel deployment config
└── 📋 package.json            # Dependencies & scripts
```

---

## 🌟 Example API Usage

### 🔐 Authentication Flow

```javascript
// 1. System Admin Login
const adminResponse = await fetch('http://localhost:3000/api/auth/system-admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'kkhotmachuil.com',
    password: 'AdminPass343'
  })
});

// 2. Create Manager Account
const managerResponse = await fetch('http://localhost:3000/api/auth/manager/signup', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    email: 'manager@alu.edu',
    name: 'John Manager',
    password: 'SecurePass123'
  })
});
```

### 📋 Course Allocation

```javascript
// Create Course Allocation
const allocation = await fetch('http://localhost:3000/api/managers/allocations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${managerToken}`
  },
  body: JSON.stringify({
    moduleId: 'module-uuid-here',
    facilitatorId: 'facilitator-uuid-here', 
    cohortId: 'cohort-uuid-here',
    classId: 'class-uuid-here',
    modeId: 'mode-uuid-here',
    trimester: 1,
    year: 2025
  })
});
```

### 📝 Activity Log Submission

```javascript
// Facilitator Activity Log
const activityLog = await fetch('http://localhost:3000/api/facilitators/activity-logs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${facilitatorToken}`
  },
  body: JSON.stringify({
    allocationId: 'allocation-uuid-here',
    weekNumber: 3,
    activities: 'Conducted advanced JavaScript workshop',
    challenges: 'Students struggled with async/await concepts',
    improvements: 'Plan to add more interactive coding exercises',
    studentsPresent: 28,
    totalStudents: 30,
    formativeGrading: 'Completed',
    summativeGrading: 'In Progress'
  })
});
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. 📤 **Push** to the branch (`git push origin feature/amazing-feature`)
5. 🔄 **Open** a Pull Request

### 📝 Contribution Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author & Support

<div align="center">

**Created with ❤️ by [Lydia Ojoawo](https://github.com/Lydia02)**

[![GitHub](https://img.shields.io/badge/GitHub-@Lydia02-181717?style=flat-square&logo=github)](https://github.com/Lydia02)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/lydia-ojoawo)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=flat-square&logo=gmail)](mailto:your.email@example.com)

### 💬 Need Help?

- 🐛 **Bug Reports**: [Create an Issue](https://github.com/Lydia02/LMS-Backend/issues)
- 💡 **Feature Requests**: [Request Feature](https://github.com/Lydia02/LMS-Backend/issues)
- 📧 **Direct Contact**: [Email Support](mailto:your.email@example.com)

</div>

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

[![Stars](https://img.shields.io/github/stars/Lydia02/LMS-Backend?style=social)](https://github.com/Lydia02/LMS-Backend/stargazers)
[![Forks](https://img.shields.io/github/forks/Lydia02/LMS-Backend?style=social)](https://github.com/Lydia02/LMS-Backend/network)

</div>
