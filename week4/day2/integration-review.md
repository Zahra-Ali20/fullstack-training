# Part 51: Environment & Integration Review Document

## 1. Environment Variables

Environment variables store configuration values such as database credentials, API URLs, and port numbers outside the source code.

We should not hardcode environment-specific values because development, testing, and production environments may require different configurations. This makes the application easier to configure and safer to maintain.

## 2. Frontend Variables

Vite exposes variables prefixed with `VITE_` to the frontend code. These values can be seen by users in the browser after the application is built.

Therefore, `VITE_` variables must never contain secrets such as database passwords, private API keys, or JWT signing secrets.

## 3. Database Configuration

Both `mysql2` and Sequelize can use environment variables loaded into `process.env`, usually through `dotenv`.

The `mysql2` connection or pool uses these values to connect to MySQL directly, while Sequelize uses them in its database configuration.

Both can use the same database credentials without duplicating those credentials in the source code.

## 4. Service Layer

Database configuration should be handled separately from controllers and service business logic.

If database credentials change, we should only need to update the environment configuration. Product and Task controllers should continue working without changes because they call services rather than managing database connections directly.

## 5. Sequelize

We should not use `sequelize.sync({ force: true })` to set up an existing database because it drops existing tables and recreates them.

This can permanently delete existing data, including products, tasks, and user records.

We should inspect the existing schema and use appropriate migrations or a controlled database setup process instead.

## 6. CORS

CORS stands for Cross-Origin Resource Sharing.

It allows a server to specify which origins are permitted to access its responses through browser-based requests. For example, our backend can allow the frontend running at `http://localhost:5173`.

CORS helps browsers enforce cross-origin access rules. It is not a replacement for authentication or authorization.

## 7. Authentication

A CORS failure occurs when the browser blocks frontend JavaScript from accessing a response because the cross-origin request does not satisfy the server's CORS policy.

A `401 Unauthorized` response means the server received the request but authentication is missing or invalid.

CORS is a browser access-control mechanism, while `401` is an HTTP authentication response.

## 8. Authorization

A CORS failure means the browser cannot access the response because of a cross-origin policy problem.

A `403 Forbidden` response means the server understood the request but refuses to allow the authenticated user to perform the requested action.

For example, a user with the `user` role may receive `403` when attempting an action restricted to the `manager` role.

## 9. Reproducibility

`SETUP.md` is part of software quality because it documents how to configure, install, run, and test the application.

It helps another developer reproduce the development environment without guessing the required commands, environment variables, database setup, or test procedures.

It also reduces setup errors and makes onboarding and debugging easier.

## 10. Debugging

If Products fail to load, I would debug the application layer by layer instead of assuming that React or the database is the problem.

1. **React:** Check the browser console for rendering errors and confirm that the product page and components are working.
2. **Redux:** Inspect the Redux state, thunk lifecycle actions, loading status, and error messages to see whether the product request succeeds or fails.
3. **CORS:** Check the browser console and Network tab for CORS errors. Confirm that the backend allows the frontend origin and handles preflight requests when required.
4. **Authentication:** Inspect the Network tab for `401` responses. Check whether the request includes a valid authentication token and whether the backend verifies it correctly.
5. **Service Layer:** Check the Product controller and service to confirm that the controller calls the correct service method and that the service executes the expected operation.
6. **Sequelize/mysql2:** Verify the database configuration, connection errors, SQL queries, model definitions, and whether the correct database access method is being used.
7. **MySQL:** Confirm that MySQL is running, the database and tables exist, credentials are correct, and the products table contains the expected records.

Finally, I would use the browser Network tab, backend logs, and database queries to identify the exact layer where the request fails before making changes.

