# Personal Task and Time Tracker

A full-stack task and time tracking application with user authentication, task management, time tracking, and analytics dashboard.

---

## 🚀 Technologies Used

### Backend
| Technology     | Version |
|----------------|---------|
| NestJS         | ^11.0.1 |
| TypeScript     | ^5.7.3  |
| TypeORM        | ^0.3.28 |
| PostgreSQL     | ^8.18.0 |
| Passport JWT   | ^4.0.1  |

### Frontend
| Technology     | Version |
|----------------|---------|
| React          | ^19.2.0 |
| Vite           | ^7.3.1  |
| TypeScript     | ~5.9.3  |
| Axios          | ^1.13.4 |
| Lucide React   | ^0.563.0|

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=task_tracker

# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Environment
NODE_ENV=development

# For Production (optional - supersedes individual DB variables)
DATABASE_URL=postgres://user:password@host:port/database
```

---

## 🗄️ Database Setup

### Prerequisites
- PostgreSQL 12+ installed and running

### Steps

1. **Create the database:**
   ```sql
   CREATE DATABASE task_tracker;
   ```

2. **Configure environment:**
   Update the `.env` file with your PostgreSQL credentials.

3. **Run migrations (automatic):**
   TypeORM is configured with `synchronize: true` in development mode, which automatically creates/updates tables based on entity definitions.

### Database Schema

| Table           | Description                                 |
|-----------------|---------------------------------------------|
| `users`         | User accounts (id, email, password, name) |
| `tasks`         | Task entries (id, title, description, priority, isCompleted, userId) |
| `time_sessions` | Time tracking sessions (id, startTime, endTime, taskId, userId) |

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL 12+

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Create .env file with variables listed above

# Start development server
npm run start:dev
```

Backend runs on: `http://localhost:3000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

### Running Both Together

Start backend first, then frontend in separate terminals, or use the `run.bat` script if available:

```bash
# Terminal 1 - Backend
cd backend && npm run start:dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

## 📡 API Endpoints Documentation

Base URL: `http://localhost:3000`

### Authentication

| Method | Endpoint         | Description        | Auth Required |
|--------|------------------|--------------------|---------------|
| POST   | `/auth/register` | Register new user  | No            |
| POST   | `/auth/login`    | Login user         | No            |
| GET    | `/auth/me`       | Get current user   | Yes           |

#### Register
```json
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "access_token": "jwt_token_here"
}
```

---

### Tasks

> All task endpoints require JWT authentication via `Authorization: Bearer <token>` header

| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| POST   | `/tasks`              | Create a new task      |
| GET    | `/tasks`              | Get all tasks for user |
| GET    | `/tasks/:id`          | Get a specific task    |
| PUT    | `/tasks/:id`          | Update a task          |
| DELETE | `/tasks/:id`          | Delete a task          |
| PATCH  | `/tasks/:id/complete` | Toggle task completion |

#### Create Task
```json
POST /tasks
{
  "title": "Task Title",
  "description": "Task description",
  "priority": "high" // "high" | "medium" | "low"
}
```

#### Update Task
```json
PUT /tasks/:id
{
  "title": "Updated Title",
  "description": "Updated description",
  "priority": "medium"
}
```

---

### Time Tracking

> All time tracking endpoints require JWT authentication

| Method | Endpoint                         | Description                       |
|--------|----------------------------------|---------------------|
| POST   | `/time-tracking/:id/timer/start`| Start timer for a task |
| POST   | `/time-tracking/:id/timer/stop` | Stop timer for a task  |
| GET    | `/time-tracking/:id/sessions`   | Get all sessions for a task|

---

### Dashboard

> Requires JWT authentication

| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| GET    | `/dashboard/stats`    | Get user statistics    |

#### Response Example
```json
{
  "totalTasks": 10,
  "completedTasks": 5,
  "totalTimeSpent": 3600,
  "tasksByPriority": {
    "high": 3,
    "medium": 4,
    "low": 3
  }
}
```

---

## 🔐 Authentication

This application uses JWT (JSON Web Token) for authentication.

1. Register or login to receive an `access_token`
2. Include the token in all authenticated requests:
   ```
   Authorization: Bearer your_jwt_token_here
   ```

---

## 📁 Project Structure

```
Personal_Task_and_Time_Tracker/
├── backend/
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── tasks/          # Task management module
│   │   ├── time-tracking/  # Time tracking module
│   │   ├── dashboard/      # Dashboard/stats module
│   │   ├── users/          # User management module
│   │   ├── app.module.ts   # Root module
│   │   └── main.ts         # Application entry point
│   ├── .env                # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API client
│   │   └── App.tsx         # Root component
│   └── package.json
└── README.md
```

---

## 📝 License

UNLICENSED - Private Project
