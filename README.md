# Finance Backend API

A robust Node.js backend for a finance management application with role-based access control, dashboard analytics, and soft delete functionality.

## Features

- **User Authentication & Authorization**: JWT-based auth with role-based access control (VIEWER, ANALYST, ADMIN)
- **Financial Records Management**: CRUD operations for income/expense records with filtering, pagination, and search
- **Dashboard Analytics**: Summary, category totals, monthly trends, and recent transactions
- **Soft Delete**: Records are marked as deleted instead of being permanently removed
- **Validation & Error Handling**: Comprehensive input validation and fallback error handling
- **MySQL Persistence**: Uses MySQL2 for database operations

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Environment**: dotenv

## Setup

1. **Clone or navigate to the project directory**

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up MySQL database**
   - Create a MySQL database named `finance_db`
   - Run the SQL schema provided in `schema.sql` (or execute the queries in the setup section)

4. **Configure environment variables**
   - Update `.env` file with your MySQL credentials and JWT secret

5. **Start the server**
   ```bash
   npm start
   ```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Users (Admin only)

- `GET /users` - Get all users
- `PATCH /users/:id/role` - Update user role
- `PATCH /users/:id/status` - Update user status

### Records

- `POST /records` - Create a new financial record (Admin)
- `GET /records` - Get records with filtering/pagination (Admin, Analyst)
- `PUT /records/:id` - Update a record (Admin)
- `DELETE /records/:id` - Soft delete a record (Admin)

### Dashboard

- `GET /dashboard/summary` - Get income/expense summary and balance
- `GET /dashboard/category` - Get totals by category
- `GET /dashboard/trends` - Get monthly trends
- `GET /dashboard/recent` - Get 5 most recent records

## Database Schema

### Users Table

- `id` (Primary Key)
- `name`
- `email` (Unique)
- `password` (Hashed)
- `role` (VIEWER/ANALYST/ADMIN)
- `status` (ACTIVE/INACTIVE)
- `created_at`

### Records Table

- `id` (Primary Key)
- `user_id` (Foreign Key to users)
- `amount` (Decimal)
- `type` (INCOME/EXPENSE)
- `category`
- `date`
- `notes`
- `deleted_at` (For soft delete)
- `created_at`

## Usage Examples

### Register a user

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get dashboard summary (include JWT token in Authorization header)

```bash
curl -X GET http://localhost:5000/dashboard/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens are required for protected routes
- Role-based access control ensures users can only access appropriate data
- Input validation prevents invalid data entry

## Error Handling

The API provides consistent error responses:

- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

## Interview Presentation Tips

When presenting this project in an interview:

1. **Start with the big picture**: Explain the business problem (finance management) and how the API solves it
2. **Walk through the architecture**: Show the folder structure and explain separation of concerns
3. **Demonstrate key features**:
   - Show authentication flow
   - Demonstrate RBAC with different user roles
   - Highlight dashboard analytics
4. **Discuss design decisions**:
   - Why MySQL over other databases?
   - Why JWT for auth?
   - Why soft delete?
5. **Show code quality**: Point out validation, error handling, and clean code structure
6. **Mention scalability**: Talk about connection pooling, pagination, and how it could handle more users

This implementation demonstrates production-ready code with proper security, validation, and maintainability.
