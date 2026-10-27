# Part 57: Production Readiness Review

## 1. Build

`npm run dev` starts a development server with features such as fast refresh and development error messages.

`npm run build` creates optimized production files that can be deployed to a web server.

## 2. Environment

Development usually uses local servers, local databases, and development settings.

Production uses deployed servers, production databases, secure environment variables, restricted CORS origins, and production-ready error handling.

## 3. Secrets

Production secrets should not be stored in Git because repositories may be shared or exposed publicly.

Database passwords, JWT secrets, and API keys should be stored in secure environment variables or a secrets manager.

## 4. CORS

`FRONTEND_ORIGIN` should contain the exact origin of the deployed frontend, including the protocol and domain.

For example, `https://app.example.com`. It should not contain a path such as `/products` or a trailing slash that causes an origin mismatch.

## 5. Error Handling

Stack traces should not be returned to users because they may expose internal file paths, database details, and implementation information.

The server should log detailed errors securely and return a generic error message to the client.

## 6. Health Check

A `/health` endpoint tells us whether the application is running and able to respond to requests.

If it also checks database connectivity, it can help identify database connection problems. A basic health check does not automatically prove that every application feature is working.

## 7. Hosted MySQL

When moving from local MySQL to hosted MySQL, we may need to change the database host, port, username, password, database name, and SSL settings.

These values should come from environment variables rather than being hardcoded in the application.

## 8. SSL

A hosted database may require SSL to encrypt data transferred between the application and the database.

SSL helps protect credentials and query data while they travel across the network. The application should follow the provider's certificate verification requirements.

## 9. IP Allowlisting

A hosted database may allow connections only from approved IP addresses.

Even with correct credentials, the connection can fail if the application's outgoing IP address is not allowlisted or a firewall blocks the connection.

## 10. Service Layer

Controllers should call service methods instead of managing database connections directly.

If MySQL moves to another host, we should update the database configuration. Controllers should not need changes because the database connection details are handled separately.

## 11. mysql2

Connection pooling reuses a group of database connections instead of creating a new connection for every query.

This improves efficiency, reduces connection setup overhead, and helps manage concurrent database requests.

## 12. Sequelize

Sequelize manages database connections through its configured connection pool.

When a query runs, Sequelize obtains an available connection from the pool and releases it for reuse when the operation finishes.

## 13. Multiple Pools

If an application initializes both `mysql2` and Sequelize pools, it may maintain two separate sets of database connections.

This can increase connection usage and resource consumption. Both pools must be configured and managed carefully, especially if the database has connection limits.

## 14. Migrations

Migrations are safer than `sequelize.sync({ force: true })` because they apply controlled, versioned schema changes.

The `force: true` option drops existing tables and recreates them, which can destroy production data. Migrations allow schema changes to be reviewed and applied deliberately.

## 15. Model vs Migration

A Sequelize model defines how the application represents and interacts with a database table.

A migration contains instructions for changing the actual database schema, such as adding a column or creating an index.

Changing a model file alone does not automatically change an existing database schema unless a synchronization or migration process applies that change.

## 16. SPA Routing

React Router handles routes in the browser, but the web server receives the initial request when someone refreshes a URL such as `/products/5`.

If the server does not redirect unknown frontend routes to `index.html`, it may return a `404` instead of loading the React application.

The production server must be configured to serve the SPA entry point for frontend routes while still handling API routes and static assets correctly.


