# Project Hub: Master Implementation Plan

This document outlines the step-by-step roadmap to build Project Hub from scratch to full deployment, ensuring all functional requirements and technical standards are met.

## Phase 1: Backend Foundation

* **Initialization:** Scaffold a Node.js and Express server environment.
* **Database Setup:** Provision and connect the application to a MongoDB instance (Atlas).
* **Folder Structure:** Create `src/` directory layout:
    * `controllers/`, `routes/`, `models/`, `middleware/`, `config/`, and `app.js`.
* **Data Models:** Define MongoDB schemas for:
    * **Users:** (Name,Email, Password)
    * **Projects:** (Title, Description (optional), User ID reference)
    * **Tasks:** (Title (required), Project ID reference, User ID reference, Status (required): `Todo`, `In Progress`, or `Done`).

## Phase 2: Core Logic & Security

* **Authentication:** Develop registration and login endpoints. Implement password hashing and JWT (JSON Web Token) generation upon successful login.
* **Middleware:** Create authorization middleware to verify JWTs, protecting all project and task-related routes.
* **CRUD Operations:** Write controllers for Create, Read, Update, and Delete actions. Business logic must remain in `controllers/` and routes must remain clean.
* **Error Handling:** Implement a central error-handling middleware in `app.js` to catch and format API errors consistently.

## Phase 3: Frontend - Next.js Application

* **Initialization:** Spin up a new Next.js application.
* **Component Building:** Use Google Stitch to generate reusable UI components (Buttons, Inputs, Cards).
* **UI Screens:** Develop the three mandatory views:
    1.  **Login/Register:** Authentication entry point.
    2.  **Project List:** Dashboard for viewing and creating projects.
    3.  **Task List:** Project-specific view for managing individual tasks.
* **Forms & State:** Implement controlled forms and manage global/local states to handle loading indicators and error messages visually.

## Phase 4: Integration & Quality Assurance

* **API Wiring:** Connect the Next.js frontend to the Express backend. Create an API utility layer to handle requests and securely pass the JWT in headers.
* **Code Cleanup:** Audit the codebase to remove `console.log` statements and ensure all sensitive URLs/Keys are moved to `.env` files.
* **Formatting:** Execute ESLint and Prettier to ensure code consistency and readability across the full stack.

## Phase 5: Deployment & Handover

* **Hosting:** * Deploy the Backend API to **Render**.
    * Deploy the Next.js Frontend to **Vercel**.
    * Configure environment variables on both platforms for database strings and JWT secrets.
* **Documentation:** Create a `README.md` including:
    * Project Overview & Tech Stack.
    * Local setup instructions.
    * Links to the live hosted application.
* **Loom Recording:** Prepare a 5–7 minute walkthrough video:
    * End-to-end user flow demonstration.
    * Line-by-line code walk-through of one Frontend component and one Backend API.
    * Reflection on a specific mistake made during development and how it was resolved.