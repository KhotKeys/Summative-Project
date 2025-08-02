# Postman API Testing Guide

## Setup Instructions

### 1. Import Collection & Environment
1. Open Postman
2. Import `Course Management system.postman_collection.json`
3. Import `Summative_API_Environment.postman_environment.json`
4. Select "Summative API Environment" from the dropdown

### 2. Server Status
- Ensure your server is running: `npm start`
- API Base URL: `http://localhost:3000`
- Database: `Summative_API` on MySQL
- Redis: Running on `127.0.0.1:6379`

### 3. Testing Flow

#### Authentication Testing
1. **System Admin Login**
   - POST `/api/auth/system-admin/login`
   - Body: `{"email": "admin@alu.edu", "password": "AdminPass123"}`
   - Save the token from response

2. **Register Manager**
   - POST `/api/auth/manager/register`
   - Use System Admin token in headers

3. **Manager Login**
   - POST `/api/auth/manager/login`
   - Save manager token

#### API Endpoints Available
- **Auth Routes**: `/api/auth/*`
- **Manager Routes**: `/api/manager/*`
- **Facilitator Routes**: `/api/facilitator/*`
- **Student Routes**: `/api/student/*`
- **Cohort Routes**: `/api/cohort/*`

### 4. Environment Variables
- `{{base_url}}` - http://localhost:3000
- `{{api_url}}` - http://localhost:3000/api
- `{{auth_token}}` - JWT token for authentication

### 5. Headers for Authenticated Requests
```
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

## Quick Test Commands

### Check Server Status
```bash
curl http://localhost:3000/api/health
```

### Test Database Connection
```bash
curl http://localhost:3000/api/status
```

Happy Testing! 🚀
