# Project Setup Guide

## 1. Prerequisites

Install the following tools before setting up the project:

- **Node.js:** Version 24.21.0 was used during verification.
- **npm:** Version 11.19.0 was used during verification.
- **MySQL Server:** Version 8.4.11 was used during verification.
- **Git:** Version 2.50.1 was used during verification.

These are the versions available in the development environment. The project package files do not declare a specific Node.js version requirement. These versions are not necessarily minimum supported versions.

## 2. Project Structure

The project contains three main application parts:

- `product-app/` — React frontend powered by Vite. Includes product, authentication, and Tickets interfaces.
- `week2/day1/api/` — Product, authentication, and Tickets API, running on port `3000`.
- `week2/day5/api/` — Tasks API, running on port `3001`.

Both APIs use the `fullstack_training` MySQL database.

The Product/Auth API contains the Tickets implementation in these files:

- `models/` — Sequelize models, including the Ticket model and its associations.
- `routes/ticketRoutes.js` — Ticket API route definitions.
- `controllers/ticketController.js` — Handles incoming Ticket requests and responses.
- `services/ticketService.js` — Ticket database operations and authorization checks.
- `validators/ticketValidator.js` — Ticket request validation.
- `middleware/authMiddleware.js` — JWT authentication and role authorization.

The frontend contains ticket list and detail pages, along with Redux state management for ticket operations.

## 3. Clone the Repository and Install Dependencies

Follow these steps for a fresh setup.

### Step 1: Clone the repository

```bash
git clone https://github.com/Zahra-Ali20/fullstack-training.git
cd fullstack-training
```

If you already have the repository cloned, navigate to your existing repository directory instead of cloning it again.

### Step 2: Install Product/Auth API dependencies

From the repository root:

```bash
cd week2/day1/api
npm install
cd ../../..
```

This API handles product operations, authentication, and Tickets.

### Step 3: Install Tasks API dependencies

```bash
cd week2/day5/api
npm install
cd ../../..
```

### Step 4: Install frontend dependencies

```bash
cd product-app
npm install
cd ..
```

Dependencies must be installed separately because the frontend and each backend have their own `package.json` files.

Continue to environment configuration and database setup before starting the applications.

## 4. Configure Environment Variables

Each application has its own `.env.example` template. Copy each template to a local `.env` file before starting the application.

**Important:** Never put real passwords, database credentials, or JWT secrets in `.env.example`. Keep real credentials in local `.env` files, and never commit those files to Git.

### A. Product/Auth API

From the repository root, run:

```bash
cp week2/day1/api/.env.example week2/day1/api/.env
nano week2/day1/api/.env
```

Configure these values in `week2/day1/api/.env`:

- `DB_HOST=localhost` — MySQL host.
- `DB_USER=your_mysql_username` — Replace with your actual MySQL username.
- `DB_PASSWORD=your_mysql_password` — Replace with your MySQL password.
- `DB_NAME=fullstack_training` — Database name.
- `DB_PORT=3306` — MySQL port.
- `PORT=3000` — Port used by the Product/Auth API.
- `JWT_SECRET=replace_with_a_long_random_secret` — Replace the placeholder with a long, random, private secret.
- `JWT_EXPIRES_IN=1h` — JWT expiration duration.
- `FRONTEND_ORIGIN=http://localhost:5173,http://localhost:5174` — Allowed frontend origins for local development.

Update the database credentials to match your local MySQL configuration. Do not use the placeholder JWT secret in a real deployment.

Tickets run through this same API and use its database connection and authentication configuration. A separate Tickets server or port is not required.

### B. Tasks API

From the repository root, run:

```bash
cp week2/day5/api/.env.example week2/day5/api/.env
nano week2/day5/api/.env
```

Configure these values in `week2/day5/api/.env`:

- `DB_HOST=localhost`
- `DB_USER=root` — Example username; change it if necessary.
- `DB_PASSWORD=` — Set your MySQL password, or leave empty only if your account genuinely has no password.
- `DB_NAME=fullstack_training`
- `DB_PORT=3306`
- `PORT=3001`

These are development defaults, not guaranteed credentials for every computer.

### C. React Frontend

From the repository root, run:

```bash
cp product-app/.env.example product-app/.env
nano product-app/.env
```

Ensure `product-app/.env` contains:

```dotenv
VITE_API_BASE_URL=http://localhost:3000/api
VITE_TASKS_API_BASE_URL=http://localhost:3001/api
```

These values assume the Product/Auth API runs on port `3000` and the Tasks API runs on port `3001`.

The Tickets interface uses the Product/Auth API, so its requests belong under `VITE_API_BASE_URL`. The Tasks API continues to use `VITE_TASKS_API_BASE_URL`.

Vite exposes variables prefixed with `VITE_` to frontend code. Never put passwords, database credentials, or private JWT secrets in frontend environment variables.

### D. Verify the Environment Files

Confirm that each local `.env` file exists:

```bash
ls -l week2/day1/api/.env
ls -l week2/day5/api/.env
ls -l product-app/.env
```

Check that `.env` files are ignored by Git:

```bash
git check-ignore week2/day1/api/.env week2/day5/api/.env product-app/.env
```

Each file should be ignored by Git. If a file is not ignored, check the repository's `.gitignore` rules before proceeding.

Keep committed `.env.example` files as templates with placeholder or non-sensitive development values.

## 5. Database Setup

Both APIs expect the `fullstack_training` database to exist and contain the tables required by their routes. The Tickets module uses the existing Product/Auth API database connection and a Ticket table associated with users.

**Important:** Do not run schema or reset scripts against a database containing data you need to preserve.

### Step 1: Create the database

```bash
mysql -u YOUR_MYSQL_USER -p
```

At the MySQL prompt:

```sql
CREATE DATABASE IF NOT EXISTS fullstack_training;
EXIT;
```

Replace `YOUR_MYSQL_USER` with your local MySQL username.

### Step 2: Run the base schema

Inspect `week2/day2/schema.sql` before running it. This file includes `DROP TABLE IF EXISTS` statements, so use it only with a fresh or disposable database after reviewing the SQL.

```bash
mysql -u YOUR_MYSQL_USER -p fullstack_training < week2/day2/schema.sql
```

### Step 3: Check and apply Sequelize migrations

The Product/Auth API uses Sequelize migrations for database changes, including authentication-related user fields. Check the migration status before applying pending changes.

```bash
cd week2/day1/api
npx sequelize-cli db:migrate:status
```

Review the migration status and database configuration. If the required migration is pending and the database is correctly configured, run:

```bash
npx sequelize-cli db:migrate
cd ../../..
```

The Tickets module also depends on its Ticket table and model configuration being consistent with the database. Before applying the Tickets migration, inspect the repository's actual migration files and confirm that the required user table exists.

Do not guess a migration filename or create a duplicate table if the migration already exists. Apply pending migrations using the project's configured Sequelize CLI setup.

Do not use `sequelize.sync({ force: true })` to initialize or reset the database; it can drop existing tables and their data.

### Step 4: Insert base sample data

Inspect `week2/day2/seed.sql`. It inserts sample users, products, orders, and order items. Running seed files repeatedly may create duplicate records.

```bash
mysql -u YOUR_MYSQL_USER -p fullstack_training < week2/day2/seed.sql
```

### Step 5: Create the tasks table

Inspect `week2/day5/tasks-schema.sql` before running it. Then run:

```bash
mysql -u YOUR_MYSQL_USER -p fullstack_training < week2/day5/tasks-schema.sql
```

### Step 6: Insert task sample data

The task seed file references user IDs `1`, `2`, and `3`. Confirm those users exist before running the seed file.

```bash
mysql -u YOUR_MYSQL_USER -p fullstack_training < week2/day5/tasks-seed.sql
```

Avoid rerunning seed files without checking whether their sample records already exist.

### Step 7: Verify the database

```bash
mysql -u YOUR_MYSQL_USER -p fullstack_training
```

At the MySQL prompt:

```sql
SHOW TABLES;
DESCRIBE users;
DESCRIBE products;
DESCRIBE tasks;
SELECT id, name, email FROM users;
SELECT * FROM products LIMIT 5;
SELECT * FROM tasks LIMIT 5;
EXIT;
```

Also verify the Ticket table after applying the relevant migration:

```sql
DESCRIBE tickets;
```

Use the actual table name defined by the Ticket model and migration if it differs from `tickets`. Inspect the Ticket model and migration for exact column types, constraints, defaults, timestamps, and foreign keys.

### E. Sequelize Models and Associations

The Ticket model belongs to the existing Sequelize model setup in `week2/day1/api/models/`.

The Ticket model associates with User in two distinct roles:

- **Creator:** The user who created the ticket.
- **Assignee:** The user assigned to handle the ticket.

These associations allow ticket responses to include creator and assignee details. Use the association aliases defined in `models/index.js` when querying or including these relationships.

The Ticket model and database migration should agree on the ticket fields, including:

- `id`
- `title`
- `description`
- `status`
- `priority`
- `created_by`
- `assigned_to`

The supported status values are `open`, `in_progress`, `resolved`, and `closed`. The supported priority values are `low`, `medium`, and `high`.

The exact SQL types, nullability, defaults, timestamp fields, and foreign-key constraints must be taken from the actual model and migration files.

## 6. Start the Applications

Run each application in a separate terminal.

### Terminal 1: Product/Auth API and Tickets

```bash
cd week2/day1/api
node server.js
```

The API uses port `3000` by default. It handles products, authentication, and Tickets.

### Terminal 2: Tasks API

```bash
cd week2/day5/api
node server.js
```

The Tasks API uses port `3001` by default.

### Terminal 3: Frontend

```bash
cd product-app
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

Tickets are served by the existing Product/Auth API, so starting a separate Tickets server is unnecessary.

## 7. Verify the Setup

### Check the frontend

From the `product-app/` directory:

```bash
npm run lint
npm run build
```

The lint command checks code quality, and the build command verifies that the frontend can be compiled for production.

### Check the APIs

After starting each API, check its terminal output for startup errors. Verify the configured endpoints using the application's routes or the browser's Network panel.

The Product/Auth API base URL is normally `http://localhost:3000/api`.

The Tasks API base URL is normally `http://localhost:3001/api`.

The Tickets endpoints are:

- `GET /api/tickets`
- `GET /api/tickets/:id`
- `POST /api/tickets`
- `PUT /api/tickets/:id`
- `DELETE /api/tickets/:id`

Ticket routes require authentication. The delete endpoint additionally requires the admin role. If an endpoint returns an error, verify the database configuration, schema, migrations, authentication token, and permissions.

## 8. CORS and Frontend Connectivity

The Product/Auth API reads `FRONTEND_ORIGIN` to configure permitted frontend origins.

For local development, the expected origin is normally `http://localhost:5173`. The environment example also allows `http://localhost:5174`. Keep only the origins your local setup needs.

Tickets use the same CORS configuration as the Product/Auth API. A separate CORS setting for Tickets is not required when they are served by the same application.

If Vite starts on another port, update the configured allowed origin accordingly. Do not configure unrestricted CORS for an authenticated application without a specific, justified requirement.

## 9. Important Notes

- Keep real `.env` files private and out of version control.
- Configure both APIs independently, even though they use the same database.
- SQL schema setup, migrations, seed data, and application startup are separate operations.
- Review the existing database before applying any schema or seed script.
- Ensure the SQL schema and seed files described in this guide are present in the repository checkout before running the database setup steps.
- The backend package files do not currently declare dedicated start scripts; use `node server.js` as documented above.

### MySQL Configuration: mysql2 and Sequelize

The project uses both `mysql2` and Sequelize for database access in different parts of the application.

**mysql2 connection pool**

The Tasks API uses `mysql2` to create a connection pool and execute raw SQL queries.

**Sequelize**

The Product/Auth API uses Sequelize for database connectivity, model definitions, and migrations. Tickets use the existing Sequelize model setup.

Each application must load the correct `.env` file and use the intended database credentials. Changing one application's `.env` does not automatically change another application's configuration.

### JWT Configuration

The Product/Auth API uses JSON Web Tokens (JWTs) to authenticate users after successful login.

- **`JWT_SECRET`** — A private server-side secret used to sign and verify JWTs.
- **`JWT_EXPIRES_IN`** — Specifies how long a JWT remains valid.

Changing `JWT_SECRET` invalidates tokens signed with the previous secret. Users with existing tokens will generally need to log in again.

Tickets use the authentication middleware provided by the Product/Auth API. Protected requests must include a valid JWT.

### Local Development Test Accounts

The following test accounts are documented for local development:

- Test User 2 — `testuser2@example.com`, role `user`.
- Test Manager — `manager@example.com`, role `manager`.
- Test Admin — `admin@example.com`, role `admin`.

Use only locally configured accounts and credentials. Do not use local test credentials in production.

The registration service assigns the default `user` role. Privileged roles must be assigned through an authorized development process, and users should log in again after a role change to obtain a fresh JWT.

## 10. Application URLs

- **Frontend:** `http://localhost:5173`
- **Products/Auth API:** `http://localhost:3000`
- **Products API:** `http://localhost:3000/api/products`
- **Authentication API:** `http://localhost:3000/api`
- **Tickets API:** `http://localhost:3000/api/tickets`
- **Tasks API:** `http://localhost:3001/api/tasks`

Configure each backend's `.env` file and the frontend's API base URLs before starting the services. Start MySQL before starting the backend APIs.

## 11. Verification Checklist

Verify each item after completing the setup.

### Application Startup

- [ ] Frontend loads at `http://localhost:5173`.
- [ ] Product/Auth API starts at `http://localhost:3000`.
- [ ] Tasks API starts at `http://localhost:3001`.

### Database Connectivity

- [ ] Products load from MySQL.
- [ ] Tasks load from MySQL.
- [ ] The Ticket table exists and matches its model and migration.
- [ ] Sequelize connects successfully to the configured database.
- [ ] Creator and assignee associations resolve correctly.

### Authentication

- [ ] User registration works with valid details.
- [ ] Passwords are stored as hashes.
- [ ] Login succeeds with valid credentials.
- [ ] Invalid login credentials are rejected.
- [ ] Authenticated requests use a valid JWT.
- [ ] Unauthenticated Ticket requests return `401`.

### Role-Based Authorization

- [ ] A normal user is denied product creation with `403 Forbidden`, according to the configured product authorization rules.
- [ ] A manager can perform the product operations allowed by the authorization rules.
- [ ] An admin can perform the operations allowed by the authorization rules.
- [ ] An assigned Ticket user can update ticket status.
- [ ] An unassigned Ticket user cannot update that ticket.
- [ ] A normal user cannot delete a ticket.
- [ ] An admin can delete a ticket.

### Product, Task, and Ticket Operations

- [ ] Product creation and updates persist in MySQL.
- [ ] Task creation and updates persist in MySQL.
- [ ] Task deletion removes the task from MySQL.
- [ ] Ticket listing and retrieval work for authenticated users.
- [ ] Ticket creation sets `created_by` from the authenticated user.
- [ ] Ticket status and priority filters return matching tickets.
- [ ] Ticket status updates follow the assigned-user and admin rules.
- [ ] Ticket deletion is restricted to admins.
- [ ] API errors are displayed appropriately in the frontend.

### Build and Configuration

- [ ] Backend environment variables load correctly.
- [ ] Frontend environment variables use the correct API URLs.
- [ ] Frontend `npm run build` succeeds.
- [ ] Frontend `npm run lint` succeeds.

## 12. Testing Commands

Run the frontend tests from the `product-app/` directory:

```bash
npm test -- --run
```

Run the backend tests from the Product/Auth API directory:

```bash
cd week2/day1/api
npm test -- --runInBand
```

Run only the Tickets API tests:

```bash
npm test -- --runInBand tests/tickets.test.js
```

The Tickets API tests cover unauthenticated access, authenticated ticket creation, assigned-user authorization, and admin-only deletion.

The frontend Tickets tests cover status filtering and role-based status controls for assigned and unassigned users.

Use controlled test data and mocks where appropriate. Do not use production records or run destructive database scripts during tests.

## 13. Troubleshooting

### Database Connection Failure

- Confirm that MySQL is running.
- Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.
- Verify that the database exists and the configured user has permission to access it.
- Restart the affected backend after correcting its configuration.

### CORS Error

- Check `FRONTEND_ORIGIN` in the Product/Auth API `.env` file.
- Ensure it includes the frontend origin, such as `http://localhost:5173`.
- Confirm that the backend CORS configuration allows the requesting origin.
- Restart the backend after changing the configuration.

### Frontend Cannot Reach Backend

- Confirm that the required backend is running.
- Check `VITE_API_BASE_URL` for the Product/Auth API.
- Check `VITE_TASKS_API_BASE_URL` for the Tasks API.
- Verify the configured ports: Product/Auth API uses `3000`, and Tasks API uses `3001`.
- Restart the Vite development server after changing frontend environment variables.

### 401 Unauthorized

- Confirm that the login credentials are correct.
- Check that the request includes a valid authentication token when required.
- Verify that the token has not expired.
- Check `JWT_SECRET` in the Product/Auth API `.env` file.
- Log in again to obtain a fresh token if necessary.

### 403 Forbidden on Ticket Operations

- Confirm that the user is authenticated.
- For status updates, verify that the user is assigned to the ticket or has the admin role.
- Remember that only admins can delete tickets.
- Verify the user's role and the ticket's `assigned_to` value in the development database.
- Do not rely solely on frontend controls to enforce permissions.

### Ticket Table or Association Errors

- Confirm that the required Ticket migration has been applied.
- Compare the actual database schema with the Ticket model.
- Check the Creator and Assignee association aliases in `models/index.js`.
- Verify that referenced user records exist.
- Review the backend terminal output before changing the schema or associations.

### Sequelize Connection Failure

- Check the database configuration variables used by the Product/Auth API.
- Confirm that the database is running and accessible.
- Check the Sequelize configuration and migration status.
- Review the backend terminal output for the specific error before retrying.

Do not share database passwords, JWT secrets, or other credentials when reporting setup errors.
