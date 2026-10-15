
# Week 2 Technical Review

## 1. What happens when an HTTP request reaches your Express application?

When a request reaches Express, it matches a route. Route middleware validates the request data before the controller runs. The controller processes the request and communicates with the MySQL database when needed. The API then sends an HTTP response to the client. If an error occurs, `next(error)` passes it to the centralized error handler.

## 2. Why do we use a MySQL connection pool?

A connection pool keeps a set of database connections available for reuse. The application does not need to create a new database connection for every request. This helps handle multiple requests efficiently and reduces connection setup overhead.

## 3. Why do we use parameterized SQL?

Parameterized SQL keeps user-supplied values separate from the SQL query structure. Without it, unsafe input could change the meaning of a query and potentially perform unintended database operations. In our Tasks API, `?` placeholders and a separate values array help prevent SQL injection.

## 4. What is the difference between validation and a database constraint?

Validation checks incoming request data before the controller performs its operation. For example, our task validator checks that a task ID is a positive integer. A database constraint protects the data stored in MySQL. For example, a foreign key on `created_by` ensures that a task references an existing user.

## 5. What is centralized error handling solving?

Centralized error handling keeps error responses in one place instead of repeating response logic in every controller. Controllers can pass errors using `next(error)`, and the error handler returns an appropriate status code and message. Without it, error responses could become inconsistent, and the same handling code would be repeated in multiple places.

## 6. What part of Week 2 do you still need to practice?

I still need to practice tracing a request through routes, validation middleware, controllers, and the database. I also want to become more confident with SQL joins, parameterized queries, and handling API errors.
