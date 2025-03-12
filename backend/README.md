
# EasyHR Backend

Backend API for the EasyHR application. This is a Node.js/Express application with MongoDB that provides API features for the HR management system.

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a .env file based on .env.example and fill in your values
4. Run the server:
   ```
   npm run dev
   ```

## API Documentation

### Authentication Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/verify-email/:token` - Verify user email
- `PUT /api/auth/create-password` - Create password after email verification
- `POST /api/auth/resend-verification` - Resend verification email
- `PUT /api/auth/update-email` - Update user email

### User Routes

- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update user details
- `PUT /api/users/password` - Update password

### Company Routes

- `GET /api/companies` - Get all companies (admin only)
- `GET /api/companies/:id` - Get single company
- `PUT /api/companies/:id` - Update company

## Security

- Authentication using JWT
- Password hashing with bcrypt
- Email verification
- Role-based authorization

## Database Models

### User
- firstName
- lastName
- email
- password (hashed)
- phoneNumber
- role (admin, hr, employee)
- company (reference to Company)
- isEmailVerified
- emailVerificationToken
- emailVerificationTokenExpire
- resetPasswordToken
- resetPasswordExpire
- createdAt

### Company
- name
- companyId
- employeesCount
- createdAt
