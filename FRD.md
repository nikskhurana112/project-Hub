# Project Hub - Functional Requirements Document (FRD)

## 1. Feature List

* **User Registration & Login:** Secure authentication system that provides a JWT upon successful login.
* **Project Management:** Full CRUD (Create, Read, Update, Delete) capabilities for user-specific projects.
* **Task Management:** The ability to add individual tasks inside specific projects.
* **Status Tracking:** Updating task statuses strictly to **Todo**, **In Progress**, or **Done**.
* **Clean UI:** Interfaces built with controlled forms and reusable components, such as Buttons and Inputs.
* **State Handling:** Visual indicators for loading states and central error handling for failed API requests.

## 2. User Flow

1.  **Step 1:** The user visits the application and is presented with the Login screen.
2.  **Step 2:** Upon successful authentication, the user is immediately redirected to the Project list.
3.  **Step 3:** The user can create a new project via a form or click an existing project to view its specific details.
4.  **Step 4:** Inside a project view, the user is presented with the Task list.
5.  **Step 5:** The user adds a new task or interacts with the UI to update the status of an existing task.

## 3. Basic Validations

* **Authentication:** Passwords must meet a minimum length requirement, and email addresses must follow a valid string format.
* **Project Input:** Project titles cannot be empty or exceed a reasonable character limit before submission to the backend.
* **Task Input:** Task titles are mandatory and cannot be left blank.
* **Status Constraints:** Task status updates submitted to the API must strictly match "Todo", "In Progress", or "Done".
* **API Protection:** All project and task backend routes must validate the presence of a valid JWT before executing logic.

## 4. Assumptions

* **Technology Stack:** The frontend will utilize **Next.js**, allowing for a highly optimized, component-driven UI, while the backend relies on **Node.js**, **Express**, and **MongoDB**.
* **Data Isolation:** Users can only view, edit, and delete projects and tasks associated with their own account.
* **Deployment Environment:** The frontend will be hosted on **Vercel**, and the backend API will be publicly accessible via **Render** with environment variables handling the database connection.