# Deployment Guide

## Part 46: Environment Configuration

Configure environment variables separately for the backend runtime and frontend build. Never commit real credentials or secrets to Git.

### Backend Runtime Variables

These variables configure the backend APIs when they start in production.

- `NODE_ENV=production` — Enables production mode.
- `PORT` — Port on which the backend API listens. The Products/Auth API uses port `3000` locally, while the Tasks API uses port `3001`.
- `DB_HOST` — Hostname of the production MySQL server.
- `DB_PORT` — Port of the MySQL server, usually `3306`.
- `DB_USER` — MySQL database username.
- `DB_PASSWORD` — MySQL database password.
- `DB_NAME` — Name of the production database.
- `JWT_SECRET` — Secret used to sign and verify authentication tokens. Use a strong, private production value.
- `JWT_EXPIRES_IN` — Defines how long a JWT remains valid.
- `FRONTEND_ORIGIN` — The deployed frontend's origin allowed by the backend CORS configuration, for example `https://app.example.com`.

The Products/Auth API uses Sequelize, while the Tasks API currently uses `mysql2` with raw SQL queries. Configure the database variables according to each API's database configuration.

Tickets are part of the Products/Auth API. They use the same backend runtime, database configuration, JWT authentication, and CORS configuration. A separate Tickets API server or port is not required.

### Frontend Build Variable

- `VITE_API_BASE_URL` — Base URL used by the Vite frontend to communicate with the Products/Auth API. The local value is `http://localhost:3000/api`. Replace it with the deployed Products/Auth API URL when building for production.
- `VITE_TASKS_API_BASE_URL` — Base URL used by the frontend to communicate with the Tasks API. Configure it with the deployed Tasks API URL before building for production.

The Tickets frontend uses `VITE_API_BASE_URL` because the Tickets routes belong to the Products/Auth API.

Vite exposes variables prefixed with `VITE_` to frontend code. Therefore, never put database passwords, `JWT_SECRET`, or other private secrets in frontend variables.

### Configuration Rules

- Store production backend variables in the hosting provider's environment-variable settings.
- Keep real `.env` files out of Git and deployment artifacts.
- Use `.env.example` to document required variable names with safe placeholder values.
- Set `FRONTEND_ORIGIN` to the actual deployed frontend origin instead of using wildcard CORS.
- Configure `VITE_API_BASE_URL` and `VITE_TASKS_API_BASE_URL` before building the frontend because Vite embeds frontend environment values into the build.
- Keep the production JWT secret private and separate from local development secrets.
- Ensure the production database contains the schema required by Products, authentication, Tasks, and Tickets.

## Part 47: Frontend Build

The frontend is located in the `product-app` directory and uses React, Vite, Redux Toolkit, and React Router.

Run the following commands from the repository root:

```bash
cd product-app
npm install
npm run build
```

### Production Build Artifact: `dist/`

Vite creates the production frontend build inside `product-app/dist/`.

This directory contains the optimized static files required to serve the frontend, including the generated HTML, JavaScript, CSS, and other assets.

Deploy the contents of `dist/` to a static hosting provider. Do not deploy `node_modules/` as the frontend production artifact.

Before building, configure the required Vite environment variables, including `VITE_API_BASE_URL` and `VITE_TASKS_API_BASE_URL`, with the URLs of the deployed backend APIs. These values are embedded into the frontend build, so changing hosting environment variables later does not automatically update an existing build.

The frontend build includes the Products, authentication, Tasks, and Tickets interfaces. The Tickets interface sends its requests to the Products/Auth API.

### React Router SPA Fallback

The frontend uses React Router for client-side navigation, including routes such as `/products/:id` and `/tasks/:id`.

Configure the production web server or hosting provider to serve `index.html` for valid frontend routes that do not correspond to physical files. This is known as an SPA fallback.

Without this configuration, navigating through the application may work, but refreshing a nested route or opening it directly can return `404 Not Found`.

API requests must still be routed to their respective backend APIs and must not be rewritten to the frontend's `index.html`.

### Build Verification

After running `npm run build`, verify that `product-app/dist/` exists and contains the generated production files.

Test the deployed frontend by:

- Opening the main page.
- Refreshing a product or task detail route.
- Opening the Tickets interface.
- Confirming that ticket listing and detail requests reach the Products/Auth API.
- Confirming that task requests reach the Tasks API.
- Checking the browser console and Network panel for failed requests.

## Part 48: Backend Startup

This project has two separate backend APIs.

### Products/Auth API

Location: `week2/day1/api`

Start the API using Node.js:

```bash
cd week2/day1/api
node server.js
```

The Products/Auth API runs on port `3000` according to the local project configuration.

It handles product operations, authentication, and Tickets. Ticket routes are registered in the existing backend application and use its authentication middleware, database configuration, and error handling.

### Tasks API

Location: `week2/day5/api`

Start the API using Node.js:

```bash
cd week2/day5/api
node server.js
```

The Tasks API runs on port `3001` according to the local project configuration.

### Production Startup

Both backend `package.json` files currently define a `test` script but do not define a `start` script. The commands above use Node.js directly and do not require `nodemon`.

For deployment, configure each backend hosting service to run its corresponding startup command. Ensure the required environment variables are configured before starting the application.

Deploy the Products/Auth API with the Ticket routes, controllers, services, validators, models, and middleware included. Deploying only the frontend Tickets pages is insufficient because the backend is responsible for database operations and authorization.

Verify that the deployed Products/Auth API can connect to the database and that the Ticket model's associations are configured correctly.

## Part 49: Database Configuration

The application uses a MySQL database. In production, both backend APIs must receive their database connection settings through environment variables configured in the hosting provider.

### Database Connection Settings

Configure the following values for each backend according to its database configuration:

- `DB_HOST` — Hostname of the hosted MySQL server.
- `DB_PORT` — Port used by the MySQL server, usually `3306`.
- `DB_NAME` — Name of the production database.
- `DB_USER` — Database username.
- `DB_PASSWORD` — Database password.

The Products/Auth API uses Sequelize for database connectivity and migrations. The Tasks API uses `mysql2` with a connection pool and raw SQL queries.

Tickets use the Products/Auth API's database connection and Sequelize models. The production database must contain the Ticket table and the related user records expected by the application.

### SSL and Network Access

- **SSL/TLS:** Enable SSL if required or recommended by the hosted MySQL provider, and follow its certificate configuration instructions.
- **IP/network allowlisting:** If the provider restricts database access by IP address or network, allow connections from the deployed backend services. Do not expose the database publicly without appropriate access controls.

### Tickets Schema and Associations

The Ticket model includes the following fields:

- `id`
- `title`
- `description`
- `status`
- `priority`
- `created_by`
- `assigned_to`

The supported ticket statuses are `open`, `in_progress`, `resolved`, and `closed`. The supported priorities are `low`, `medium`, and `high`.

The exact SQL types, nullability, defaults, timestamps, indexes, and foreign-key constraints must match the actual Ticket model and migration files in the repository.

The Ticket model has two relationships with the User model:

- **Creator:** Identifies the user who created the ticket.
- **Assignee:** Identifies the user assigned to handle the ticket.

The deployed database must contain valid user references for these relationships. The association aliases configured in the Sequelize models must match those used by the Ticket service.

Before deploying Ticket-related changes, verify that the production schema matches the model and that the necessary migrations have been applied.

## Part 50: mysql2 and Sequelize

This project uses both `mysql2` and Sequelize in separate backend APIs.

### Products/Auth API — Sequelize

Location: `week2/day1/api`

- `config/sequelize.js` initializes the Sequelize database connection.
- `server.js` calls `sequelize.authenticate()` to verify database connectivity.
- Sequelize models are defined for entities such as `User`, `Product`, and `Ticket`.
- Sequelize migrations are used for schema changes.
- The Ticket service uses the Sequelize models and their configured associations to retrieve and modify tickets.

### Tasks API — mysql2

Location: `week2/day5/api`

- `config/db.js` creates a MySQL connection pool using `mysql2`.
- `services/taskService.js` uses this pool to execute raw SQL queries.
- The current task routes and service layer use `mysql2`, not the Sequelize task models. Sequelize task models also exist in the project, but they are not used by the current task API operations.

### Environment-Based Database Configuration

Both APIs use these environment variables for database configuration:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

The database credentials are read from environment configuration rather than being hardcoded in the database connection code.

### Connection Pooling

The Tasks API uses a `mysql2` connection pool configured in `config/db.js`. Its connections can be reused for multiple SQL queries.

The Products/Auth API uses Sequelize's database connection management. Its exact pool limits are determined by the Sequelize configuration.

### Schema and Migrations

The Sequelize models and raw SQL queries must remain compatible with the MySQL schema used by the application.

The Products/Auth API uses Sequelize migrations for schema changes. The Tasks API performs database operations using raw SQL, so its queries depend directly on the deployed table and column definitions.

Ticket schema changes must be applied through the appropriate database migration before deploying application code that depends on the changed fields or relationships.

`sequelize.sync({ force: true })` must not be used to reset the existing production database because it can drop tables and delete data.

## Part 51: Database Migration Strategy

This project uses MySQL as its database, with two backend APIs accessing it through different approaches. The Products/Auth API uses Sequelize migrations for schema changes, while the Tasks API uses `mysql2` and raw SQL queries.

### How Schema Changes Are Applied

**Products/Auth API**

- Sequelize models define the structure of entities such as `User`, `Product`, and `Ticket`.
- Versioned Sequelize migration files are used to apply database schema changes.
- Before deploying a code change that depends on a new or modified column, table, or constraint, the corresponding migration must be applied to the production database.
- Migration status and the target database must be checked before applying changes.
- Ticket schema changes must include any required changes to the Ticket table, its user references, and related constraints.

**Tasks API**

- The current Tasks API service layer uses raw SQL queries through the `mysql2` connection pool.
- Its queries depend on the existing MySQL table and column definitions.
- Schema changes affecting tasks must be applied to the database using the project's SQL schema or migration process, where available, before deploying code that depends on those changes.

### When Migrations Run

Database migrations should run as a controlled deployment step, before the application version that requires the new schema begins handling requests.

For the Products/Auth API, the configured Sequelize migrations are the mechanism for applying versioned schema changes. They should be checked and run against the intended database as part of deployment.

For example, from the Products/Auth API directory:

```bash
cd week2/day1/api
npx sequelize-cli db:migrate:status
```

Review the output and verify that the CLI points to the intended production database. Apply pending migrations only after confirming the target database and reviewing the migrations:

```bash
npx sequelize-cli db:migrate
```

These commands must be run with the production environment configured correctly. Do not run them against production accidentally from a local environment.

The Tasks API's raw SQL queries do not automatically update the database schema. Any required schema changes must be applied separately.

### Why `sequelize.sync({ force: true })` Must Not Be Used

The existing production database must not be reset using `sequelize.sync({ force: true })`.

The `force: true` option drops existing tables before recreating them. This can delete stored users, products, tasks, tickets, and other existing data, and can disrupt foreign-key relationships.

Versioned migrations and reviewed SQL schema changes provide a controlled way to update the schema without treating the production database as disposable.

### What Happens If Code and Schema Versions Do Not Match

If the deployed application expects a database structure that has not been applied, database operations may fail.

Examples include:

- A query references a column that does not exist, causing a SQL error.
- Code expects a newly added table that has not been created.
- A renamed or removed column causes older queries to fail.
- A changed constraint rejects data that the application previously allowed.
- The Ticket service expects a Creator or Assignee association that is missing or configured under a different alias.

These failures can result in API errors, failed requests, or unavailable application features.

To reduce this risk, database changes must be reviewed alongside the application code that depends on them. Migrations should be applied to the correct database, and the APIs should be verified after deployment.

### Production Safety

- Back up important production data before risky schema changes.
- Verify the target database and migration status before applying changes.
- Apply schema changes before deploying code that requires them.
- Test affected API operations after migration.
- Avoid destructive schema changes unless their data impact and recovery plan have been reviewed.

A complete automated CI/CD migration pipeline is not part of this setup yet. The priority is to apply schema changes deliberately and keep the database compatible with both backend APIs.

## Part 52: Secrets Management

Production secrets must be configured through the hosting provider's environment-variable or secret-management settings.

Examples of sensitive environment variables used by this project include:

- `DB_PASSWORD` — The password used to connect to the MySQL database.
- `JWT_SECRET` — The secret used to sign and verify JSON Web Tokens.

Other environment variables can also contain environment-specific configuration and should be reviewed before deployment.

### Role of `.env.example`

The `.env.example` file documents the names of environment variables required by the application. It may contain example or placeholder values to show the expected configuration.

It must not contain real database passwords, JWT secrets, or other sensitive credentials.

### Production Deployment

- Configure the required secrets directly in the hosting provider's environment settings.
- Do not commit real secrets to Git.
- Do not upload a real `.env` file as a deployment artifact.
- Ensure the deployed application receives its configuration through the hosting environment.
- If a secret is accidentally exposed, replace or rotate it as appropriate.

The Ticket module uses the existing Products/Auth API JWT configuration. Do not introduce a frontend `VITE_` variable for `JWT_SECRET` or any other private backend secret.

## Part 53: CORS Configuration

The backend APIs use the `FRONTEND_ORIGIN` environment variable to configure the allowed frontend origin.

For production deployment, `FRONTEND_ORIGIN` must contain the actual deployed frontend's origin, including the protocol.

Example placeholder:

```env
FRONTEND_ORIGIN=https://app.example.com
```

Replace this placeholder with the real frontend origin when deploying the application.

The Products/Auth API and Tasks API must allow requests from the deployed frontend origin. The configured origin must match the origin from which the browser loads the frontend.

Tickets use the Products/Auth API's CORS configuration because their routes are part of the same backend application. A separate Tickets CORS configuration is not required.

Wildcard CORS (`*`) must not be used for this authenticated production application without a specific, justified requirement. The production configuration should specify the intended frontend origin.

## Part 54: Production Error Handling

The application uses error-handling middleware in its backend APIs. Production deployments must use the appropriate environment configuration:

```env
NODE_ENV=production
```

The production error behavior should be verified against the actual error-handling implementation in each API before deployment.

Clients should receive safe, structured error responses that provide enough information to handle a failed request without unnecessarily exposing internal implementation details. Detailed debugging information, database credentials, JWT secrets, and other sensitive configuration must not be included in client-facing error responses.

The current application error handlers should be reviewed to confirm exactly what is returned for unexpected errors. Setting `NODE_ENV=production` alone is not proof that every internal error detail is hidden.

After deployment, verify the responses for validation failures, missing resources, authentication failures, authorization failures, and unexpected server errors.

For Tickets, verify that validation errors and permission failures return the expected HTTP status codes and safe response messages. Do not expose stack traces or private configuration through Ticket API responses.

## Part 55: Health Check

Both backend APIs expose a health endpoint:

- Products/Auth API: `GET /health` on port `3000`.
- Tasks API: `GET /health` on port `3001`.

For local development, these correspond to:

- `http://localhost:3000/health`
- `http://localhost:3001/health`

The expected response is:

```json
{
  "status": "ok"
}
```

During deployment, check the health endpoint to confirm that the API responds successfully.

The basic health endpoint verifies application responsiveness. A successful response does not necessarily confirm that every dependency, such as MySQL, authentication, or the other backend API, is working correctly. Database connectivity and important application operations must be verified separately.

Because Tickets are served by the Products/Auth API, the Products/Auth API health endpoint is the relevant initial health check for that module. Also verify Ticket operations against the deployed database.

## Part 56: Deployment Verification

After deploying the frontend and both backend APIs, verify the following items.

### Frontend

- [ ] The React frontend loads from its deployed URL.
- [ ] Direct frontend routes work, including `/`, `/products/new`, `/products/:id`, `/cart`, `/tasks`, `/tasks/new`, and `/tasks/:id`.
- [ ] Refreshing a direct route works without returning a hosting-provider 404 error.
- [ ] The Tickets list and detail interfaces load successfully.

### Backend APIs

- [ ] The Products/Auth API starts and responds successfully.
- [ ] The Tasks API starts and responds successfully.
- [ ] `GET /health` returns HTTP `200` with the expected health response for both APIs.
- [ ] Ticket requests reach the Products/Auth API rather than the Tasks API.

### Authentication and Authorization

- [ ] A user can register with valid details.
- [ ] Login works with valid credentials.
- [ ] Invalid login credentials are rejected.
- [ ] Authenticated requests use a valid JWT.
- [ ] Expired or invalid JWTs are rejected.
- [ ] Role-based access control blocks operations that the user's role is not permitted to perform.

### Products and Tasks

- [ ] Products load from the database and appear in the frontend.
- [ ] Product creation, updates, and deletion work according to the configured authorization rules.
- [ ] Tasks load from the database and appear in the frontend.
- [ ] Task creation, updates, and deletion work as expected.
- [ ] Changes persist in MySQL after refreshing the frontend.

### Tickets

- [ ] The Ticket table exists in the production database.
- [ ] The Ticket model and deployed database schema match.
- [ ] The Creator and Assignee associations resolve correctly.
- [ ] Authenticated users can retrieve the ticket list and ticket details.
- [ ] Unauthenticated Ticket requests return `401 Unauthorized`.
- [ ] Ticket creation stores the authenticated user's ID as `created_by`; the client cannot choose another creator by supplying a different value.
- [ ] Ticket status and priority values are validated.
- [ ] The ticket status filter returns matching tickets.
- [ ] An assigned user can update ticket status when permitted by the backend rules.
- [ ] An unassigned user cannot update another user's ticket.
- [ ] An assigned non-admin user cannot modify fields beyond the permitted status update.
- [ ] An admin can perform the Ticket operations allowed by the backend authorization rules.
- [ ] A normal user cannot delete a ticket.
- [ ] Ticket deletion is restricted to admins.
- [ ] Validation and authorization errors return the expected status codes.
- [ ] Ticket changes persist in the production database.

### Database and Configuration

- [ ] Both APIs connect to the intended production MySQL database.
- [ ] Required environment variables are configured in the hosting environment.
- [ ] `FRONTEND_ORIGIN` matches the deployed frontend origin.
- [ ] The production frontend uses the correct API base URLs.
- [ ] Required schema changes have been applied before deploying code that depends on them.

### Security and Error Handling

- [ ] No CORS errors appear in the browser console during normal application operations.
- [ ] Client-facing error responses do not expose secrets or unnecessary internal debugging details.
- [ ] Real `.env` files and production secrets are not included in deployment artifacts.
- [ ] `NODE_ENV=production` is configured for the production backend environment.

### Automated Checks

- [ ] The frontend production build completes successfully with `npm run build`.
- [ ] The frontend lint check passes with `npm run lint`, if the script is defined.
- [ ] Backend tests pass using the configured test script.
- [ ] Ticket authorization tests pass.
- [ ] Frontend Ticket filtering and role-based UI tests pass.

Mark each checklist item complete only after verifying it in the deployed application or through the relevant API, database, or automated check.

### Failure 1: Incorrect `DB_PASSWORD`

**Change:** Temporarily replaced the Products/Auth API's database password with an incorrect value in `week2/day1/api/.env`.

**Actual observation:**

The API printed:

`Unable to connect to the database. Check database configuration.`

The process returned to the terminal prompt instead of continuing to run.

**How the failing layer was identified:**

The failure occurred when running `node server.js`, immediately during database connection setup. This identified the database connectivity/configuration layer rather than a frontend or browser CORS issue.

**Recovery:** Restored the original `DB_PASSWORD` and restarted the API.

### Failure 2: Incorrect `VITE_API_BASE_URL`

**Change:** Temporarily changed the frontend's `VITE_API_BASE_URL` from `http://localhost:3000/api` to `http://localhost:3999/api`.

**Actual observation:** The frontend loaded at `http://localhost:5174/`, but the Product Manager displayed: “Unable to connect to the server. Please check your connection and try again.”

**How the failing layer was identified:** The frontend itself loaded, but the product-fetching operation failed after the API base URL was changed to an incorrect port. This indicated a frontend API configuration or network connection failure rather than a frontend page-loading failure.

**Recovery:** Restored `VITE_API_BASE_URL` to `http://localhost:3000/api` and restarted the Vite development server.