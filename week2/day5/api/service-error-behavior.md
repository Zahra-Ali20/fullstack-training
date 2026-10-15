# Part 21: Service Error Behavior

## Chosen Approach

The service layer throws application-level errors using `AppError`.

For example, when `taskService.getTaskById(9999)` cannot find a task, the service throws `AppError("Task not found", 404)`.

## Error Flow

1. The controller calls the service method.
2. The service checks whether the requested task exists.
3. If the task does not exist, the service throws an `AppError` with status code 404.
4. The controller catches the error and passes it to `next(error)`.
5. The centralized error handler sends the HTTP 404 response.

## Why This Approach?

This keeps task-related error behavior inside the service layer and avoids repeating the same not-found checks in multiple controllers.

We consistently use `AppError` for application-level errors and the centralized error handler for HTTP error responses.
