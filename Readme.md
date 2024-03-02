# TaskMeLater

A backend API for seamless task management, enabling users to prioritize, organize, and tackle tasks at their convenience. Dynamic task prioritization, scheduling, and reminder functionalities empower users to stay productive and focused on what matters most.

## Features

- User authentication and authorization
- CRUD operations for tasks and subtasks
- Task prioritization based on due dates
- Soft deletion of tasks and subtasks
- Voice calling using Twilio for overdue tasks

## Routes

### User Routes

- `POST /api/v1/user/register`

  - Description: Register a new user.
  - Request Body:
    - phoneNumber: The phone number of the user (10 digits).
    - priority: The priority level of the user (0, 1, or 2).
  - Response:
    - 201: User created successfully.

- `POST /api/v1/user/login`
  - Description: Login existing user.
  - Request Body:
    - phoneNumber: The phone number of the user (10 digits).
  - Response:
    - 200: User logged in successfully.

### Task Routes

- `GET /api/v1/tasks`

  - Description: Get tasks for the authenticated user.
  - Query Parameters:
    - priority (optional): Filter tasks by priority.
    - status (optional): Filter tasks by status.
    - due_date (optional): Filter tasks by due date.
    - page (optional): Page number for pagination.
    - limit (optional): Limit of tasks per page.
  - Response:
    - 200: Tasks retrieved successfully.

- `POST /api/v1/tasks/create`

  - Description: Create a new task.
  - Request Body:
    - title: Title of the task.
    - description: Description of the task.
    - due_date: Due date of the task (YYYY-MM-DD format).
  - Response:
    - 201: Task created successfully.

- `PATCH /api/v1/tasks/:taskId`

  - Description: Update task data.
  - Request Body (optional):
    - due_date: New due date of the task (YYYY-MM-DD format).
    - status: New status of the task (TODO, IN_PROGRESS, or DONE).
  - Response:
    - 200: Task updated successfully.

- `DELETE /api/v1/tasks/:taskId`
  - Description: Soft delete a task.
  - Response:
    - 200: Task deleted successfully.

### Subtask Routes

- `GET /api/v1/subtasks`

  - Description: Get subtasks for the authenticated user.
  - Query Parameters:
    - status (optional): Filter subtasks by status.
    - task_id (optional): Filter subtasks by task ID.
    - page (optional): Page number for pagination.
    - limit (optional): Limit of subtasks per page.
  - Response:
    - 200: Subtasks retrieved successfully.

- `POST /api/v1/subtasks/create`

  - Description: Create a new subtask.
  - Request Body:
    - task_id: ID of the task to which the subtask belongs.
  - Response:
    - 201: Subtask created successfully.

- `PATCH /api/v1/subtasks/:subtaskId`

  - Description: Update subtask status.
  - Request Body:
    - status: New status of the subtask (0 for incomplete, 1 for complete).
  - Response:
    - 200: Subtask status updated successfully.

- `DELETE /api/v1/subtasks/:subtaskId`
  - Description: Soft delete a subtask.
  - Response:
    - 200: Subtask deleted successfully.

## Cron Jobs

- **Task Priority Updater**

  - Description: A cron job that runs daily at midnight to update the priority of tasks based on their due dates.
  - File: cron-jobs/taskPriorityUpdater.js

- **Twilio Voice Caller**
  - Description: A cron job that runs daily at midnight to call users via Twilio for overdue tasks, based on user priority.
  - File: cron-jobs/twilioVoiceCaller.js

## Installation

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up environment variables.
4. Run the server using `npm start`.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Twilio API
