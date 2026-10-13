# Tasks API Documentation

## Database

The Tasks API uses a MySQL database with two main tables: `tasks` and `users`.

The `tasks` table stores task information, including title, description, status, priority, creator, assigned user, creation time, and update time.

- `id` is the primary key of the task.
- `created_by` references `users.id` and identifies the user who created the task.
- `assigned_to` references `users.id` and identifies the user assigned to the task. It can be `NULL` when no user is assigned.
- `created_at` stores when the task was created.
- `updated_at` stores when the task was last updated.

A user can create multiple tasks and can be assigned multiple tasks. The creator relationship is required, while the assignee relationship is optional.

## Endpoints




| GET | `/api/tasks` | Returns all tasks. |
| GET | `/api/tasks/:id` | Returns a task by its ID. |
| POST | `/api/tasks` | Creates a new task. |
| PUT | `/api/tasks/:id` | Updates an existing task. |
| DELETE | `/api/tasks/:id` | Deletes a task. |

### Get All Tasks

`GET /api/tasks`

Returns a list of tasks, including creator and assignee information.

### Get Task by ID

`GET /api/tasks/:id`

Returns one task matching the supplied ID.

### Create Task

`POST /api/tasks`

Required fields:
- `title`
- `status`
- `priority`
- `created_by`

Optional fields:
- `description`
- `assigned_to`

Example request:


{
  "title": "Complete API documentation",
  "description": "Document the Tasks API",
  "status": "pending",
  "priority": "medium",
  "created_by": 1,
  "assigned_to": null
}


A successful request returns status `201 Created`.

### Update Task

`PUT /api/tasks/:id`

Updates the task identified by the URL ID.

### Delete Task

`DELETE /api/tasks/:id`

Deletes the task identified by the URL ID. A successful deletion returns `204 No Content`.

## Filters

The `GET /api/tasks` endpoint supports these query parameters:


`status` | Filters tasks by status. |
`priority` | Filters tasks by priority. |
`assigned_to` | Filters tasks by assigned user ID. |

Example:

`GET /api/tasks?status=pending&priority=medium&assigned_to=2`

Multiple filters can be combined.

## Validation

The API validates request bodies, URL parameters, and query parameters before running the controller.

- `title` is required when creating a task and must satisfy the title length rules.
- `status` must be one of the values allowed by the task validator.
- `priority` must be one of the values allowed by the task validator.
- `created_by` must identify an existing user.
- `assigned_to` must identify an existing user when a value is supplied. It can be `null`.
- Task IDs must be positive integers.
- Filter values must satisfy the rules defined in the task validator.

The exact accepted status values, priority values, and title length limits are defined in `validators/tasksValidator.js`.

## Error Responses

### 422 Unprocessable Entity

Returned when request validation fails.

Example:


{
  "errors": [
    {
      "field": "id",
      "message": "Task ID must be a positive integer"
    }
  ]
}


### 404 Not Found

Returned when the requested task or referenced user does not exist.

Example:
{
    "message": "Assigned user not found"
}


### 500 Internal Server Error

Returned when an unexpected server error occurs.

Example:

{
  "message": "Internal server error"
}  


Internal database and server error details are not exposed in the response.

## Update Contract

The `PUT /api/tasks/:id` endpoint expects the required update fields to be provided in the request body. It is not a partial-update endpoint.

If a required field is missing, the request should fail validation. Optional `description` can be `null` or omitted, and `assigned_to` can be `null` to remove the assignment.

Use `PUT` with the complete set of required update fields. A successful update returns status `200 OK`.
