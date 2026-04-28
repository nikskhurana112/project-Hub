# Project Hub

## Project Overview
Project Hub is a full-stack internal tool designed to streamline project and task management. It allows authenticated users to create secure workspaces, add specific tasks to those projects, and track progress through a strictly controlled status workflow (Todo, In Progress, Done). The application features a secure REST API and a component-driven, responsive user interface.

## Tech Stack Used
**Frontend:**
* Next.js (React Framework)
* Context API / React State for state management
* Vercel (Deployment)

**Backend:**
* Node.js & Express.js
* MongoDB with Mongoose
* JSON Web Tokens (JWT) for secure authentication
* Render (Deployment)

## Deployment URLs & Deliverables
* **Frontend (Live):** `https://project-hub-alpha-ecru.vercel.app/`
* **Backend API (Live):** `https://project-hub-backend-q93m.onrender.com`
* **Functional Requirements Document (FRD):** `https://github.com/nikskhurana112/project-Hub/blob/main/FRD.md`
* **Loom Video Walkthrough:** ``

## Local Setup Steps

### 1. Clone the Repository
```bash
git clone https://github.com/nikskhurana112/project-Hub/tree/main
cd project-hub
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:3000
```
Start the development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Start the Next.js development server:
```bash
npm run dev
```

## Folder Structure Explanation
This project utilizes a monorepo structure to cleanly separate client and server logic.

```text
project-hub/
├── backend/               # Node.js + Express API
│   ├── src/
│   │   ├── config/        # Database and environment configurations
│   │   ├── controllers/   # Core business logic for endpoints
│   │   ├── middleware/    # JWT verification and central error handling
│   │   ├── models/        # Mongoose database schemas
│   │   ├── routes/        # Clean API route definitions
│   │   └── app.js         # Express server entry point
│
└── frontend/              # Next.js Application
    ├── app/               # Next.js App Router (pages and layouts)
    ├── components/        # Reusable UI elements (Buttons, Inputs, Forms)
    ├── context/           # React Context (e.g., AuthContext)
    └── lib/               # Utility functions and API clients
```

## API Reference

### Authentication
* `POST /api/users/register` - Create a new user account.
* `POST /api/users/login` - Authenticate user and return JWT.

### Projects
* `GET /api/projects` - Retrieve all projects for the logged-in user.
* `POST /api/projects` - Create a new project.
* `GET /api/projects/:id` - Retrieve specific project details.
* `PUT /api/projects/:id` - Update a project.
* `DELETE /api/projects/:id` - Delete a project.

### Tasks
* `POST /api/projects/:projectId/tasks` - Add a new task to a specific project.
* `PUT /api/tasks/:taskId` - Update task status (Strictly: 'Todo', 'In Progress', 'Done').
* `DELETE /api/tasks/:taskId` - Remove a task.

