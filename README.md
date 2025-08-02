# Course Management Platform Backend

A Node.js backend application for academic institutions to support faculty operations, monitor student progress, and enhance academic coordination. Built with Express.js, Sequelize (MySQL), and Redis.

---

##  Video Demonstration

A short walkthrough video showcasing the platform’s functionality, API testing, and Redis notifications.

**Watch on YouTube**:

## i18n Student Reflection Page
 Hosted Live: [https://khotkeys.github.io/Summative-Project/]

 ---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema-overview)
- [Authentication & Authorization](#authentication--authorization)
- [API Documentation](#api-documentation)
- [i18n Student Reflection Page](#i18n-student-reflection-page)
- [Redis Notifications](#redis-notifications)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Example Requests](#example-requests)
- [License](#license)

---

## Features

### Module 1: Course Allocation System
- Managers can create, update, and delete course allocations.
- Facilitators can view only their assigned courses.
- Filter allocations by cohort, trimester, intake period, mode, and facilitator.

### Module 2: Facilitator Activity Tracker (FAT)
- Facilitators submit weekly logs per course.
- Managers can monitor logs and receive alerts.
- Redis is used to queue and send reminders for overdue submissions.

### Module 3: Student Reflection Page
- Students create a multilingual reflection page.
- Supports language switcher (English/French).
- Hosted via GitHub Pages.

---

##  Tech Stack

- **Backend**: Node.js, Express
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT & bcrypt
- **Queuing System**: Redis
- **Nodemailer**: To send Email
- **Testing**: Jest
- **Internationalization**: Vanilla JS + JSON translations

---
## Getting Started

1. **Clone the Repository**

```bash
git clone https://github.com/Lydia02/LMS-Backend.git
cd LMS-Backend
```

2. **Install Dependencies**

```bash
npm install
```

3. **Set Up Environment Variables**

Create a `.env` file in the root directory with the following values:

```env
# === Database Settings ===
DB_USER=add_yours
DB_PASS=add_yours
DB_NAME=add_yours
DB_HOST=localhost
REDIS_URL=add_yours

# === JWT Secret Key ===
JWT_SECRET=add_yours

# === App Port (optional) ===
PORT=3000

# === Email Notification Settings ===
NODEMAILER_EMAIL=add_yours
NODEMAILER_PASS=add_yours
NODEMAILER_HOST=add_yours
```

>  **Note**: Be sure to keep `.env` files private. Never expose secrets in version control.

4. **Migrate & Seed the Database**

```bash
npx sequelize-cli db:migrate
# (Optional) Seed the database
npx sequelize-cli db:seed:all
```

5. **Start the Server**

```bash
npm start
```

6. **Start Redis Notification Worker**

```bash
node notification-system/notificationWorker.js
```

##  Database Schema Overview

- `Manager`
- `Facilitator`
- `Student`
- `Module`
- `Class`
- `Mode` (Online, In-Person, Hybrid)
- `CourseOffering` (Allocation)
- `ActivityTracker`
- `Notification`

### Relationships

- `Manager` → manages → `Allocations`
- `Facilitator` → assigned to → `Allocations`
- `Allocation` → has many → `ActivityLogs`

---

## Authentication & Authorization

- Users login via `/api/auth/login`
- JWT is returned and must be passed as `Authorization: Bearer <token>`
- Role-based middleware: 
  - Only managers can assign courses
  - Only facilitators can submit logs

---

## API Documentation

API documentation is available via Postman.

- **Download the Postman Collection**: Refer to the file included at [Course-Management-System](https://github.com/Lydia02/LMS-Backend/blob/master/Course%20Management%20system.postman_collection.json)
- To import:
  - Open Postman
  - Click **Import** > **Upload Files**
  - Select the collection JSON file provided

This collection includes:
- Auth flows
- Course allocation operations
- Facilitator activity submissions
- Manager monitoring and filters
- Notification simulation endpoints

---

## i18n Student Reflection Page

- Located in: `student-reflection-page/`
- Contains:
  - `index.html`, `scripts/translation.js`
  - CSS styles in `styles.css`
- Language Switcher: English ⇄ French
- All content is dynamically rendered using a translation dictionary object
- Hosted Live: [https://reflection-page.netlify.app/](https://reflection-page.netlify.app/)

---

## Redis Notifications

- `notificationWorker.js`: Processes queues
- `scheduler.js`: Pushes reminders (run with cron or trigger manually)
- Queues:
  - Weekly reminder for facilitators
  - Alert for managers on missing reports

---

## Testing

Run tests using:

```bash
npm test
```

Tests written for:

- Models: `facilitator`, `cohort`, `manager`, `activity`
- Utility functions: `validation`, `queries`
- Auth & Middleware

---

## Project Structure

```
├── config/               # DB & Redis config
├── controllers/          # Route handlers
├── middleware/           # Auth and role checks
├── migrations/           # Sequelize migrations
├── models/               # Sequelize models
├── routes/               # Express routes
├── services/             # Business logic
├── tests/                # Unit tests
├── utils/                # Helper functions
├── student-reflection-page/ # i18n HTML site
├── notification-system/  # Redis workers and scheduler
├── app.js / server.js    # Express entry point
```

---

## Example Requests

### Login (Manager)

```http
POST /api/auth/manager/login
Content-Type: application/json

{
  "email": "chinyere.okafor@alu.edu",
  "password": "ManagerPass123"
}
```

---

### Create Course Allocation

```http
POST /api/managers/allocations
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "moduleID": "MODULE_UUID",
  "facilitatorID": "FACILITATOR_UUID",
  "cohortID": "COHORT_UUID",
  "classID": "CLASS_UUID",
  "modeID": "MODE_UUID",
  "trimester": 1,
  "year": 2024
}
```

---

### Submit Activity Log

```http
POST /api/facilitators/activity-logs
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "allocationId": "ALLOCATION_UUID",
  "weekNumber": 3,
  "attendance": ["student1", "student2"],
  "formativeOneGrading": "Done",
  "formativeTwoGrading": "Pending",
  "summativeGrading": "Not Started",
  "courseModeration": "Done",
  "intranetSync": "Pending",
  "gradeBookStatus": "Not Started"
}
```

---

## License

This project is for educational purposes only.

---

## Author

**Lydia Ojoawo**  
GitHub: [@Lydia02](https://github.com/Lydia02)

