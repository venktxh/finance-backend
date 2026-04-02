# Finance Data Processing & Access Control Backend

## Overview

This project implements a backend system for a finance dashboard that manages financial records, user roles, and aggregated analytics. The system is designed to demonstrate clean API design, role-based access control, and structured data handling.

---

## Features

- JWT-based authentication  
- Role-based access control (Admin, Analyst, Viewer)  
- Financial records CRUD operations  
- Record filtering (type, category, date, search)  
- Pagination support  
- Dashboard analytics (summary, category totals, trends, recent activity)  
- Soft delete functionality  
- Input validation and error handling  
- Rate limiting  

---

## Roles and Permissions

| Role    | Permissions |
|--------|------------|
| Admin   | Full access (create, update, delete records, manage users) |
| Analyst | View all records and dashboard |
| Viewer  | View dashboard only |

---

## Tech Stack

- Node.js  
- Express.js  
- MySQL  
- JWT (Authentication)  
- bcrypt (Password hashing)  

---

## Project Structure

```
src/
 ├── controllers/
 ├── routes/
 ├── middleware/
 ├── db.js
 ├── app.js
 └── server.js
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/finance-backend.git
cd finance-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=finance_db
JWT_SECRET=your_secret
```

### 4. Setup Database

```sql
CREATE DATABASE finance_db;
USE finance_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('ADMIN','ANALYST','VIEWER') DEFAULT 'VIEWER',
  status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  amount DECIMAL(10,2),
  type ENUM('INCOME','EXPENSE'),
  category VARCHAR(100),
  date DATE,
  notes TEXT,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Run the Server

```bash
node src/server.js
```

Server will start on:

```
http://localhost:5000
```

---

## Authentication

### Login

```
POST /auth/login
```

#### Request

```json
{
  "email": "admin@test.com",
  "password": "Password@123"
}
```

#### Response

```json
{
  "token": "JWT_TOKEN"
}
```

Use token in headers:

```
Authorization: Bearer <TOKEN>
```

---

## API Endpoints

### User APIs (Admin only)

- GET `/users`  
- PATCH `/users/:id/role`  
- PATCH `/users/:id/status`  

---

### Records APIs

- POST `/records` (Admin only)  
- GET `/records` (Admin, Analyst)  
- PUT `/records/:id` (Admin only)  
- DELETE `/records/:id` (Admin only)  

Supports filtering, search, and pagination.

---

### Dashboard APIs (All roles)

- GET `/dashboard/summary`  
- GET `/dashboard/category`  
- GET `/dashboard/trends`  
- GET `/dashboard/recent`  

---

## Access Control

- Authentication using JWT middleware  
- Authorization using role-based middleware  
- Restricted endpoints based on user roles  

---

## Validation and Error Handling

- Input validation for all APIs  
- Password strength validation  
- Proper HTTP status codes  
- Clear error messages  

---

## Design Decisions

- Admin is responsible for managing all financial records  
- Analysts are responsible for viewing and analyzing data  
- Viewers can only access aggregated dashboard insights  
- Dashboard APIs return global aggregated data  
- Soft delete is used to preserve historical data  

---

## Limitations

- No frontend interface included  
- Runs locally (no deployment)  
- Dashboard is not user-specific  

---

## Future Improvements

- User-specific dashboards  
- Unit and integration testing  
- Swagger/OpenAPI documentation  
- Cloud deployment  

---

## Testing

APIs can be tested using Postman.  
You may include a Postman collection for convenience.

---

## Conclusion

This backend demonstrates a structured and maintainable system with clear role-based access control, efficient data handling, and well-defined APIs suitable for a finance dashboard application.
