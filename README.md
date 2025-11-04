# Identity Service

A robust identity service built with NestJS, MongoDB, and Mongoose, featuring user authentication, registration, and role-based access control (RBAC).

## Architecture

### Tech Stack
- **Framework**: NestJS
- **Database**: MongoDB
- **ORM**: Mongoose
- **Authentication**: JWT
- **Containerization**: Docker & Docker Compose
- **API Documentation**: Swagger/OpenAPI

### System Components
1. **Authentication System**
   - JWT-based authentication
   - User registration
   - Login with token generation
   - Password change functionality
   - Login tracking

2. **User Management**
   - User registration
   - Profile management
   - Secure password handling with bcrypt
   - Role assignment (Admin only)

3. **Role-Based Access Control (RBAC)**
   - Admin and User roles
   - Role-based route protection
   - Middleware for authorization

4. **Database Schema**
   ```
   User
   ├── _id (ObjectId)
   ├── emailId (unique)
   ├── password (hashed)
   ├── username
   ├── role (ADMIN | USER)
   ├── createdAt
   └── updatedAt

   LoginRecord
   ├── _id (ObjectId)
   ├── userId (ObjectId ref)
   ├── ipAddress
   └── loginAt
   ```

## API Documentation

### Authentication APIs

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "John Doe"
}
```
Response: `201 Created`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "emailId": "user@example.com",
  "username": "John Doe",
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
Response: `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

#### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```
Response: `200 OK`

### User APIs

#### Get Current User
```http
GET /api/users/me
Authorization: Bearer <token>
```
Response: `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "emailId": "user@example.com",
  "username": "John Doe",
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Update Current User Profile
```http
PATCH /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "John Doe Updated"
}
```

#### Get All Users (Admin Only)
```http
GET /api/users
Authorization: Bearer <token>
```

#### Get User by ID (Admin Only)
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Update User Role (Admin Only)
```http
PATCH /api/users/:id/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "ADMIN"
}
```

## Setup and Running

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)
- MongoDB (for local development)

### Environment Setup
1. Copy environment file:
   ```bash
   cp .env.example .env
   ```
2. Update environment variables in `.env` if needed

### Running with Docker

1. **First-time Setup**
   ```bash
   # Make entrypoint script executable
   chmod +x docker-entrypoint.sh

   # Build and start services
   docker-compose up -d --build
   ```

2. **Seed Admin User**
   ```bash
   # Run seed script
   docker-compose exec app npm run seed:admin
   ```

3. **Verify Service**
   ```bash
   # Check if service is running
   curl http://localhost:3000/api/health
   ```

4. **Useful Commands**
   ```bash
   # View logs
   docker-compose logs -f

   # Stop services
   docker-compose down

   # Restart services
   docker-compose restart
   ```

### Development

1. **Local Development**
   ```bash
   # Install dependencies
   npm install

   # Start MongoDB locally or use Docker
   # Update DATABASE_URL in .env

   # Run in development mode
   npm run start:dev

   # Seed admin user
   npm run seed:admin
   ```

2. **Access Swagger Documentation**
   - Navigate to: `http://localhost:3000/api/docs`

## Security Features

1. **Authentication**
   - JWT-based authentication
   - Password hashing with bcrypt (10 rounds)
   - Token expiration (1 hour)

2. **Authorization**
   - Role-based access control (RBAC)
   - Admin and User roles
   - Protected routes with guards

3. **Data Protection**
   - Input validation
   - Password strength requirements (minimum 8 characters)
   - Email uniqueness validation

## Error Handling

The API uses standard HTTP status codes:
- `200 OK`: Successful request
- `201 Created`: Resource created
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server error
