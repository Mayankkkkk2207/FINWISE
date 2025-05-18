# FinWise - Financial Management Application

A modern full-stack application for managing personal finances, setting goals, and learning about financial literacy.

## Prerequisites

Before running the application, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://dev.mysql.com/downloads/mysql/) (v8.0 or higher)

## Setup Instructions

### 1. Database Setup
1. Install MySQL if you haven't already
2. Create a new database named `finwise`:
```sql
CREATE DATABASE finwise;
```
3. Use the default username `root` and password `1234567890`

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
```bash
cd finwise-backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```
The backend server will run on http://localhost:3001

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
```bash
cd finwise
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend application:
```bash
npm start
```
The application will open in your default browser at http://localhost:3000

## Features
- User authentication
- Budget tracking and management
- Financial goal setting and tracking
- Interactive financial education modules
- Modern, responsive UI with animations

## Troubleshooting
1. If you get database connection errors:
   - Make sure MySQL is running
   - Verify the password in the backend configuration
   - Check if the database exists

2. If you get "module not found" errors:
   - Delete the node_modules folder
   - Run `npm install` again

3. If the frontend can't connect to the backend:
   - Ensure the backend server is running on port 3001
   - Check for any firewall restrictions

## Support
If you encounter any issues, please:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure all setup steps were followed in order 