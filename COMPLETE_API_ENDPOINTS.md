# 🚀 Complete API Endpoints List for Postman Testing

## Base URL
```
http://localhost:3000
```

## � **Quick Start Commands**

### Development Setup
```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Create database and run migrations
npx sequelize-cli db:create
npx sequelize-cli db:migrate

# Start Redis server (if not running)
# Windows: Use portable Redis from /redis folder
# Linux/Mac: redis-server

# Start the application
npm start          # Production mode
npm run dev        # Development mode (with nodemon)
```

### Testing Commands
```bash
# Run all tests (43 tests across 6 test suites)
npm test

# Run tests with coverage report (24.75% overall coverage)
npm run test:coverage

# Run specific test suites
npm run test:auth              # Authentication tests (5 tests)
npm run test:managers          # Manager functionality tests (9 tests)
npm run test:facilitators      # Facilitator functionality tests (8 tests)
npm run test:manager-activity  # Manager activity tests (15 tests)
npm run test:cohorts          # Cohort management tests (5 tests)
npm run test:notifications    # Notification system tests (1 test)
npm run test:integration      # Controller integration tests (NEW!)
```

### Worker & Background Services
```bash
# Start notification worker (separate process)
npm run worker

# Start notification scheduler (separate process) 
npm run scheduler

# Note: Workers are automatically started with the main application
# These commands are for running workers independently
```

### Database Commands
```bash
# Create database
npx sequelize-cli db:create

# Run migrations
npx sequelize-cli db:migrate

# Rollback last migration
npx sequelize-cli db:migrate:undo

# Reset database (drop and recreate)
npx sequelize-cli db:drop
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

### System Admin Setup
```bash
# The system admin is automatically created when you run the API
# Default credentials:
# Email: kkhotmachuil@gmail.com
# Password: AdminPass343
```

## �📋 **Table of Contents**
- [Authentication Endpoints](#authentication-endpoints)
- [Manager Endpoints](#manager-endpoints)
- [Facilitator Endpoints](#facilitator-endpoints)
- [Student Endpoints](#student-endpoints)
- [Cohort Management](#cohort-management)
- [Management Data Setup](#management-data-setup)
- [Activity Logs & Compliance](#activity-logs--compliance)

---

## 🔐 **Authentication Endpoints**
**Base Path:** `/api/auth`

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/system-admin/login` | System admin login | No | - |
| PATCH | `/approve/:role/:id` | Approve user registration | Yes | system_admin |
| POST | `/manager/signup` | Register manager | No | - |
| POST | `/manager/login` | Manager login | No | - |
| POST | `/facilitator/signup` | Register facilitator | No | - |
| POST | `/facilitator/login` | Facilitator login | No | - |
| POST | `/student/signup` | Register student | No | - |
| POST | `/student/login` | Student login | No | - |

### Sample Request Bodies:

**System Admin Login:**
```json
{
  "email": "kkhotmachuil@gmail.com",
  "password": "AdminPass343"
}
```

**Manager Registration:**
```json
{
  "email": "manager@alu.edu",
  "name": "Manager Name",
  "password": "ManagerPass123"
}
```

**Facilitator Registration:**
```json
{
  "email": "g.pawuoi@alueducation.com",
  "name": "Gabriel Pawuoi",
  "password": "GabrielPass123",
  "qualification": "Master's in Computer Science",
  "location": "Kigali, Rwanda"
}
```

---

## 👨‍💼 **Manager Endpoints**
**Base Path:** `/api/managers`

### Allocation Management
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/allocations` | Create new allocation | Yes | manager |
| GET | `/allocations` | Get all allocations | Yes | manager |
| GET | `/allocations/:id` | Get allocation by ID | Yes | manager |
| PATCH | `/allocations/:id` | Update allocation | Yes | manager |
| DELETE | `/allocations/:id` | Delete allocation | Yes | manager |

### Allocation Filtering
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/allocations/filter/trimester/:trimester/year/:year` | Filter by trimester/year | Yes | manager |
| GET | `/allocations/filter/cohort/:cohortId` | Filter by cohort | Yes | manager |
| GET | `/allocations/filter/intake/:intake` | Filter by intake | Yes | manager |
| GET | `/allocations/filter/facilitator/:facilitatorId` | Filter by facilitator | Yes | manager |
| GET | `/allocations/filter/mode/:modeId` | Filter by mode | Yes | manager |

### Activity Log Management
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/activity-logs` | Get all activity logs | Yes | manager |
| GET | `/activity-logs/:logId` | Get specific activity log | Yes | manager |
| PUT | `/activity-logs/:logId/status` | Update log status | Yes | manager |

### Activity Log Filtering
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/facilitator/:facilitatorId/logs` | Get logs by facilitator | Yes | manager |
| GET | `/course/:allocationId/logs` | Get logs by course | Yes | manager |
| GET | `/week/:weekNumber/logs` | Get logs by week | Yes | manager |
| GET | `/status/:field/:status` | Get logs by status | Yes | manager |

### Compliance & Reporting
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/compliance/week/:weekNumber` | Get compliance summary | Yes | manager |
| GET | `/compliance/report/:startWeek/:endWeek` | Get compliance report | Yes | manager |
| GET | `/missing-submissions/:weekNumber` | Get missing submissions | Yes | manager |
| POST | `/compliance/check/:weekNumber` | Trigger compliance check | Yes | manager |
| POST | `/reminders/send/:weekNumber` | Send reminders | Yes | manager |

---

## 👨‍🏫 **Facilitator Endpoints**
**Base Path:** `/api/facilitators`

### Course & Allocation Management
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/my-courses` | Get assigned courses | Yes | facilitator |
| GET | `/allocations` | Get my allocations | Yes | facilitator |
| GET | `/allocations/:id` | Get allocation by ID | Yes | facilitator |

### Allocation Filtering
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/allocations/filter/trimester/:trimester/year/:year` | Filter my allocations by trimester | Yes | facilitator |
| GET | `/allocations/filter/mode/:modeId` | Filter my allocations by mode | Yes | facilitator |

### Activity Logs
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/activity-logs` | Create activity log | Yes | facilitator |
| GET | `/activity-logs` | Get my activity logs | Yes | facilitator |
| GET | `/activity-logs/:id` | Get activity log by ID | Yes | facilitator |
| PATCH | `/activity-logs/:id` | Update activity log | Yes | facilitator |
| DELETE | `/activity-logs/:id` | Delete activity log | Yes | facilitator |

### Sample Activity Log Request:
```json
{
  "allocationId": 1,
  "weekNumber": 1,
  "activities": "Conducted lecture on JavaScript fundamentals",
  "challenges": "Students had difficulty with async concepts",
  "improvements": "Plan to add more practical examples",
  "studentsPresent": 25,
  "totalStudents": 30
}
```

**Note:** This activity log would be created by Gabriel Pawuoi (g.pawuoi@alueducation.com) for his assigned courses.

---

## 👨‍🎓 **Student Endpoints**
**Base Path:** `/api/students`

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/profile` | Get student profile | Yes | student |
| PATCH | `/profile` | Update profile | Yes | student |
| PUT | `/profile/password` | Change password | Yes | student |
| GET | `/dashboard` | Get student dashboard | Yes | student |

---

## 👥 **Cohort Management**
**Base Path:** `/api/cohorts`

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/` | Create cohort | Yes | manager/system_admin |
| GET | `/` | Get all cohorts | Yes | Any authenticated |
| GET | `/:id` | Get cohort by ID | Yes | Any authenticated |
| PUT | `/:id` | Update cohort | Yes | manager/system_admin |
| DELETE | `/:id` | Delete cohort | Yes | manager/system_admin |

### Sample Cohort Request:
```json
{
  "name": "Cohort 2025-1",
  "startDate": "2025-01-15",
  "endDate": "2025-12-15",
  "intake": "January 2025"
}
```

---

## ⚙️ **Management Data Setup**
**Base Path:** `/api/setup`

### Modules
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/modules` | Create module | Yes | manager/system_admin |
| GET | `/modules` | Get all modules | No | - |

### Classes
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/classes` | Create class | Yes | manager/system_admin |
| GET | `/classes` | Get all classes | No | - |

### Modes
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/modes` | Create mode | Yes | manager/system_admin |
| GET | `/modes` | Get all modes | No | - |

### Sample Requests:

**Module:**
```json
{
  "name": "Web Development",
  "code": "WD101",
  "description": "Introduction to Web Development"
}
```

**Class:**
```json
{
  "name": "Morning Class",
  "schedule": "09:00-12:00"
}
```

**Mode:**
```json
{
  "name": "Online",
  "description": "Virtual learning mode"
}
```

---

## 🔒 **Authentication Headers**

For all protected endpoints, include:
```
Authorization: Bearer {your_jwt_token}
Content-Type: application/json
```

---

## 📊 **Response Status Codes**

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## 🧪 **Testing Flow Recommendation**

### Before Testing - Application Setup:
```bash
# 1. Install and setup
npm install
npm start

# 2. Verify server is running
# Should see: "Server is running on port 3000"
# Should see: "Your database connection has been established successfully"
# Should see: "Redis connected successfully"
```

### Testing Steps:
1. **Start with Authentication:**
   - System Admin Login (Email: kkhotmachuil@gmail.com, Password: AdminPass343)
   - Create Manager, Facilitator, Student accounts
   - Login with different roles

2. **Create Test Users:**
   - **Facilitator:** Gabriel Pawuoi (g.pawuoi@alueducation.com, Password: GabrielPass123)
   - **Manager:** Use existing manager credentials
   - **Students:** Create test student accounts

3. **Setup Management Data:**
   - Create Modules, Classes, Modes
   - Create Cohorts

4. **Manager Operations:**
   - Create Allocations
   - Test filtering and management features

5. **Facilitator Operations (Gabriel):**
   - View assigned courses
   - Create and manage activity logs

6. **Student Operations:**
   - View profile and dashboard

7. **Compliance & Reporting:**
   - Test compliance checks
   - Generate reports

### Run Tests:
```bash
# Test the API functionality (All 43 tests passing!)
npm test

# Check test coverage (24.75% overall coverage)
npm run test:coverage

# Test specific functionality
npm run test:auth              # ✅ 5/5 Authentication tests passing
npm run test:managers          # ✅ 9/9 Manager tests passing  
npm run test:facilitators      # ✅ 8/8 Facilitator tests passing
npm run test:manager-activity  # ✅ 15/15 Manager activity tests passing
npm run test:cohorts          # ✅ 5/5 Cohort tests passing
npm run test:notifications    # ✅ 1/1 Notification tests passing
```

### 🔍 **Test Coverage Analysis:**

**Current Coverage:**
- ✅ **Services**: 53.48% (Well tested - business logic covered)
- ⚠️ **Controllers**: 0% (Needs improvement - HTTP handlers not tested)
- ⚠️ **Utils**: 5.42% (Basic coverage - validation functions need more tests)

**Why Controller Testing Matters:**
- Controllers handle HTTP requests/responses
- They validate input data and handle errors
- They're the entry point for all API endpoints
- They connect routes to business logic

**Recommended Improvements:**
```bash
# Add integration tests for HTTP endpoints
# Test request/response handling
# Test error scenarios (400, 401, 403, 404, 500)
# Test authentication middleware
# Test input validation
```

**Example Controller Test Structure:**
```javascript
// Test HTTP endpoints with supertest
import request from 'supertest';
import app from '../app.js';

describe('POST /api/auth/facilitator/login', () => {
  test('should login Gabriel successfully with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/facilitator/login')
      .send({
        email: 'g.pawuoi@alueducation.com',
        password: 'GabrielPass123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.name).toBe('Gabriel Pawuoi');
  });
});
```

---

## 📝 **Complete Endpoints List (47 Total)**

### 🔐 Authentication Endpoints (8)
```
POST   /api/auth/system-admin/login
PATCH  /api/auth/approve/:role/:id
POST   /api/auth/manager/signup
POST   /api/auth/manager/login
POST   /api/auth/facilitator/signup
POST   /api/auth/facilitator/login
POST   /api/auth/student/signup
POST   /api/auth/student/login
```

### 👨‍💼 Manager Endpoints (20)
#### Allocation Management (5)
```
POST   /api/managers/allocations
GET    /api/managers/allocations
GET    /api/managers/allocations/:id
PATCH  /api/managers/allocations/:id
DELETE /api/managers/allocations/:id
```

#### Allocation Filtering (5)
```
GET    /api/managers/allocations/filter/trimester/:trimester/year/:year
GET    /api/managers/allocations/filter/cohort/:cohortId
GET    /api/managers/allocations/filter/intake/:intake
GET    /api/managers/allocations/filter/facilitator/:facilitatorId
GET    /api/managers/allocations/filter/mode/:modeId
```

#### Activity Log Management (3)
```
GET    /api/managers/activity-logs
GET    /api/managers/activity-logs/:logId
PUT    /api/managers/activity-logs/:logId/status
```

#### Activity Log Filtering (4)
```
GET    /api/managers/facilitator/:facilitatorId/logs
GET    /api/managers/course/:allocationId/logs
GET    /api/managers/week/:weekNumber/logs
GET    /api/managers/status/:field/:status
```

#### Compliance & Reporting (5)
```
GET    /api/managers/compliance/week/:weekNumber
GET    /api/managers/compliance/report/:startWeek/:endWeek
GET    /api/managers/missing-submissions/:weekNumber
POST   /api/managers/compliance/check/:weekNumber
POST   /api/managers/reminders/send/:weekNumber
```

### 👨‍🏫 Facilitator Endpoints (10)
#### Course & Allocation Management (3)
```
GET    /api/facilitators/my-courses
GET    /api/facilitators/allocations
GET    /api/facilitators/allocations/:id
```

#### Allocation Filtering (2)
```
GET    /api/facilitators/allocations/filter/trimester/:trimester/year/:year
GET    /api/facilitators/allocations/filter/mode/:modeId
```

#### Activity Logs (5)
```
POST   /api/facilitators/activity-logs
GET    /api/facilitators/activity-logs
GET    /api/facilitators/activity-logs/:id
PATCH  /api/facilitators/activity-logs/:id
DELETE /api/facilitators/activity-logs/:id
```

### 👨‍🎓 Student Endpoints (4)
```
GET    /api/students/profile
PATCH  /api/students/profile
PUT    /api/students/profile/password
GET    /api/students/dashboard
```

### 👥 Cohort Management Endpoints (5)
```
POST   /api/cohorts/
GET    /api/cohorts/
GET    /api/cohorts/:id
PUT    /api/cohorts/:id
DELETE /api/cohorts/:id
```

### ⚙️ Management Data Setup Endpoints (6)
#### Modules (2)
```
POST   /api/setup/modules
GET    /api/setup/modules
```

#### Classes (2)
```
POST   /api/setup/classes
GET    /api/setup/classes
```

#### Modes (2)
```
POST   /api/setup/modes
GET    /api/setup/modes
```

---

## 🎯 **Total Endpoints: 47**

Your API has **47 different endpoints** ready for testing in Postman!
