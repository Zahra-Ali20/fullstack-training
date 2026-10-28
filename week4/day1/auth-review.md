# Part 45: Authentication Review Document

## 1. Authentication vs Authorization

**Authentication** verifies who the user is, usually through email and password.

**Authorization** checks what an authenticated user is allowed to do based on their role or permissions.

## 2. Password Hashing

We use **bcrypt** to hash passwords before storing them in the database. It makes passwords difficult to recover if the database is compromised. We should never store plain-text passwords.

## 3. JWT

A **JWT (JSON Web Token)** contains claims such as the user's ID and role, along with metadata in its header and payload.

Its signature helps verify that the token has not been modified and was signed by a trusted party. The payload is not encrypted by default.

## 4. 401 vs 403

- **401 Unauthorized:** Returned when authentication is missing or invalid, such as when a token is missing, expired, or invalid.
- **403 Forbidden:** Returned when the user is authenticated but does not have permission to perform the requested action.

## 5. Authentication Middleware

The `authenticate` middleware verifies the user's JWT, validates the token, and identifies the authenticated user. It typically attaches the user's information to `req.user` so later middleware and controllers can use it.

## 6. Authorization Middleware

The `requireRole` middleware checks whether the authenticated user's role is allowed to access a particular route or perform an action. If the role is not permitted, it returns a 403 response.

## 7. Service Layer

Authentication database logic belongs in `authService` because it separates business logic and database operations from the controller. This makes the code easier to maintain, test, and reuse.

The controller handles HTTP requests and responses, while the service handles authentication-related operations.

## 8. ORM

**Sequelize** fits between the authentication service and the database. It allows the service to interact with database tables through models and methods instead of writing raw SQL for every operation.

For example, `User.findOne()` can find a user by email during login.

## 9. Frontend Security

Hiding a button is not sufficient authorization because users can still send requests directly to the backend using tools such as curl or Postman.

The backend must verify authentication and permissions on every protected endpoint.

## 10. Task Ownership

The `created_by` value should eventually come from `req.user.id` instead of the request body because users could otherwise submit another person's ID and pretend that person created the task.

Using the authenticated user's ID on the backend helps prevent identity spoofing and keeps task ownership trustworthy.

