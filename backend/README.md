# Mandir Donation Management System - Backend

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Headers
All protected routes require JWT token:
```
Authorization: Bearer <your_jwt_token>
```

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mandir-donation
JWT_SECRET=your_jwt_secret_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
NODE_ENV=development
```

## Installation

```bash
npm install
npm start
```

## Features

- JWT Authentication
- MongoDB Database
- Automated SMS Reminders
- Role-Based Access Control
- Donation Management
- User Management

## Default Admin

```
Username: shobhit
Password: W0rk@0990
```