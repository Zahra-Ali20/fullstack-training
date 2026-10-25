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

- `product-app/` — React frontend powered by Vite.
- `week2/day1/api/` — Product and authentication API, running on port `3000`.
- `week2/day5/api/` — Tasks API, running on port `3001`.

Both APIs use the `fullstack_training` MySQL database.

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

**Important:** Never put real passwords, database credentials, or JWT secrets in `.env.example`. Keep real credentials in your local `.env` files, and never commit those files to Git.

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
- `JWT_SECRET=replace_with_a_long_random_secret` — Replace the placeholder with a long, random, private secret. Never share or commit the real secret.
- `JWT_EXPIRES_IN=1h` — JWT expiration duration; the current configuration is one hour.
- `FRONTEND_ORIGIN=http://localhost:5173,http://localhost:5174` — Allowed frontend origins for local development. Keep only the origins the API needs to allow.

Update the database credentials to match your local MySQL configuration. Do not use the placeholder JWT secret in a real deployment.

### B. Tasks API

From the repository root, run:

```bash
cp week2/day5/api/.env.example week2/day5/api/.env
nano week2/day5/api/.env
```

Configure these values in `week2/day5/api/.env`:

- `DB_HOST=localhost` — MySQL host.
- `DB_USER=root` — Example MySQL username; change it if your local username differs.
- `DB_PASSWORD=` — Set your MySQL password. Leave it empty only if your MySQL account genuinely has no password.
- `DB_NAME=fullstack_training` — Database name.
- `DB_PORT=3306` — MySQL port.
- `PORT=3001` — Port used by the Tasks API.

These are development defaults, not guaranteed credentials for every computer. Update them to match your local MySQL configuration.

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

These values assume the Product/Auth API runs on port `3000` and the Tasks API runs on port `3001`. Change them if your local backend URLs are different.

Vite exposes variables prefixed with `VITE_` to frontend code. Never put passwords, database credentials, or private JWT secrets in frontend environment variables.

### D. Verify the Environment Files

Confirm that each local `.env` file exists:

```bash
ls -l week2/day1/api/.env
ls -l week2/day5/api/.env
ls -l product-app/.env
```

Before committing changes, check that `.env` files are ignored by Git:

```bash
git check-ignore week2/day1/api/.env week2/day5/api/.env product-app/.env
```

Each file should be ignored by Git. If a file is not ignored, check the repository's `.gitignore` rules before proceeding. Do not force-add secret-bearing `.env` files.

Keep the committed `.env.example` files as templates with placeholder or non-sensitive development values. Each developer should create and configure their own local `.env` files.

## 5. Database Setup

Both APIs expect the `fullstack_training` database to exist and contain the tables required by their routes.

**Important:** Do not run schema or reset scripts against a database containing data you need to preserve.

### Step 1: Create the database

```bash
mysql -u YOUR_MYSQL_USER -p
```

At the MySQL prompt, run:

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

### Step 3: Check and apply the authentication migration

The Product/Auth API includes a Sequelize migration that adds authentication-related columns to the `users` table. The base `users` table must exist before applying the migration.

```bash
cd week2/day1/api
npx sequelize-cli db:migrate:status
```

Review the migration status and database configuration. If the required migration is pending and the database is correctly configured, run:

```bash
npx sequelize-cli db:migrate
cd ../../..
```

Do not run migrations blindly against a database containing important data. Do not use `sequelize.sync({ force: true })` to initialize or reset the database; it can drop existing tables and their data.

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

At the MySQL prompt, run:

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

If a table or column differs from these examples, inspect the actual schema files and migration results. A successful database connection does not automatically create missing tables.

## 6. Start the Applications

Run each application in a separate terminal.

### Terminal 1: Product/Auth API

```bash
cd /path/to/fullstack-training/week2/day1/api
node server.js
```

Replace `/path/to/fullstack-training` with the actual location of your repository.

The API uses port `3000` by default and checks the database connection during startup.

### Terminal 2: Tasks API

```bash
cd /path/to/fullstack-training/week2/day5/api
node server.js
```

The Tasks API uses port `3001` by default.

### Terminal 3: Frontend

```bash
cd /path/to/fullstack-training/product-app
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## 7. Verify the Setup

### Check the frontend

From the `product-app/` directory:

```bash
npm run lint
npm run build
```

The lint command checks code quality, and the build command verifies that the frontend can be compiled for production.

### Check the APIs

After starting each API, check its terminal output for startup errors. Verify the configured API endpoints using the application's routes or the browser's Network panel.

The Product/Auth API base URL is normally `http://localhost:3000/api`.

The Tasks API base URL is normally `http://localhost:3001/api`.

If an endpoint returns a database error, verify the database name, credentials, schema, migration status, and referenced records.

## 8. CORS and Frontend Connectivity

The Product/Auth API reads `FRONTEND_ORIGIN` to configure permitted frontend origins.

For local development, the expected origin is normally `http://localhost:5173`. The environment example also allows `http://localhost:5174`. Keep only the origins your local setup needs. If Vite starts on another port, update the configured allowed origin accordingly.

Do not configure unrestricted CORS for an authenticated application without a specific, justified requirement.

## 9. Important Notes

- Keep real `.env` files private and out of version control.
- Configure both APIs independently, even though they use the same database.
- SQL schema setup, migrations, seed data, and application startup are separate operations.
- Review the existing database before applying any schema or seed script.
- Ensure the SQL schema and seed files described in this guide are present in the repository checkout before running the database setup steps.
- The backend package files do not currently declare dedicated start scripts; use `node server.js` as documented above.

### MySQL Configuration: mysql2 and Sequelize

The project uses both `mysql2` and Sequelize for database access in different parts of the application. Where applicable, both database access layers use the same database connection settings:

- `DB_HOST` — MySQL server hostname
- `DB_PORT` — MySQL server port
- `DB_USER` — MySQL username
- `DB_PASSWORD` — MySQL password
- `DB_NAME` — database name

**mysql2 connection pool**

The Tasks API uses `mysql2` to create a connection pool and execute raw SQL queries. The pool reads the database credentials from the configured environment variables.

**Sequelize**

The Product/Auth API uses Sequelize for database connectivity, model definitions, and migrations. Its database configuration uses the corresponding environment variables.

**Important:** Each application must load the correct `.env` file and use the same intended database credentials. Keep actual credentials in local `.env` files, not in committed `.env.example` files. Do not assume that changing one application's `.env` automatically changes the other application's configuration.

### JWT Configuration

The Product/Auth API uses JSON Web Tokens (JWTs) to authenticate users after successful login.

- **`JWT_SECRET`** — A private, server-side secret used to sign and verify JWTs. Each developer must generate their own strong, unpredictable secret and store it in their local `.env` file. Never commit or share the real secret, and never expose it in frontend environment variables.
- **`JWT_EXPIRES_IN`** — Specifies how long a JWT remains valid. For example, `1h` represents one hour. Choose a value appropriate for the application's authentication requirements.

**Important security note:** Changing `JWT_SECRET` invalidates tokens signed with the previous secret because the server can no longer verify their signatures using the new secret. Users with existing tokens will generally need to log in again to obtain new tokens.

Keep placeholder values in `.env.example`. Each developer must configure their own secure local `JWT_SECRET` in `.env` before running the API.

## 10. Test Users and Role-Based Access

### Local Development Test Accounts

The following test accounts exist in the local `fullstack_training` database. Their records and roles were verified directly in MySQL.
### Local Development Test Accounts

The following test accounts exist in the local `fullstack_training` database. Their records and roles were verified directly in MySQL.

- **Test User 2**
  - Email: `testuser2@example.com`
  - Role: `user`

- **Test Manager**
  - Email: `manager@example.com`
  - Role: `manager`

- **Test Admin**
  - Email: `admin@example.com`
  - Role: `admin`

These accounts were created for local development testing, not through the sample seed file.

These accounts were created for local development testing, not through the sample seed file.

### How the Accounts Are Created

1. Register each account through the application's registration endpoint with a name, email, and password.
2. The registration service hashes the password using `bcryptjs` and assigns the default `user` role.
3. For local role-based authorization testing, assign the `manager` and `admin` roles separately in the local development database.
4. Log in again after changing a role so the application issues a fresh JWT containing the updated role.
5. Test the permissions available to each role.

The `User` model and database migration support `user`, `manager`, and `admin` roles. Public registration does not allow a client to choose a privileged role.

### Security Notes

- Use these accounts only in a local development environment.
- Do not use local test credentials in production.
- Do not commit real passwords, password hashes, JWT secrets, or production credentials to the repository.
- Role changes must be performed only in an authorized development environment.
## 11. Application Startup

The application consists of a frontend and two backend APIs. Start each service in a separate terminal from the project root.

### 1. Start the Products/Auth API

```bash
cd week2/day1/api
node server.js
```

Expected URL: `http://localhost:3000`

This API handles product operations and authentication.

### 2. Start the Tasks API

```bash
cd week2/day5/api
node server.js
```

Expected URL: `http://localhost:3001`

This API handles task operations.

### 3. Start the Frontend

Open a third terminal and run:

```bash
cd product-app
npm run dev
```

Expected URL: `http://localhost:5173`

### Application URLs

- **Frontend:** `http://localhost:5173`
- **Products/Auth API:** `http://localhost:3000`
- **Products API endpoint:** `http://localhost:3000/api/products`
- **Authentication API:** `http://localhost:3000/api`
- **Tasks API endpoint:** `http://localhost:3001/api/tasks`

### Startup Notes

- Configure each backend's `.env` file before starting the server.
- Configure the frontend `.env` file with the appropriate API base URLs.
- Start MySQL before starting the backend APIs.
- Keep all three services running while testing the complete application.
- If a port is already in use, resolve the port conflict before starting the affected service.

## 12. Verification Checklist

Verify each item after completing the setup.

### Application Startup
- [ ] Frontend loads at `http://localhost:5173`.
- [ ] Products/Auth API starts at `http://localhost:3000`.
- [ ] Tasks API starts at `http://localhost:3001`.

### Database Connectivity
- [ ] Products load from MySQL.
- [ ] Tasks load from MySQL.
- [ ] Sequelize connects successfully to the configured database.

### Authentication
- [ ] User registration works with valid details.
- [ ] Passwords are stored as hashes.
- [ ] Login succeeds with valid credentials.
- [ ] Invalid login credentials are rejected.
- [ ] Authenticated requests use a valid JWT.

### Role-Based Authorization
- [ ] A normal user is denied product creation with `403 Forbidden`.
- [ ] A manager can perform the product operations allowed by the authorization rules.
- [ ] An admin can perform the operations allowed by the authorization rules.
- [ ] Unauthorized requests are rejected.

### Product and Task Operations
- [ ] Product creation and updates persist in MySQL.
- [ ] Task creation and updates persist in MySQL.
- [ ] Task deletion removes the task from MySQL.
- [ ] API errors are displayed appropriately in the frontend.

### Build and Configuration
- [ ] Backend environment variables load correctly.
- [ ] Frontend environment variables use the correct API URLs.
- [ ] Frontend `npm run build` succeeds.
- [ ] Frontend `npm run lint` succeeds, if a lint script is configured.

## 13. Troubleshooting

### Database Connection Failure

If a backend cannot connect to MySQL:

- Confirm that MySQL is running.
- Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in the backend's `.env` file.
- Verify that the database exists and the configured user has permission to access it.
- Restart the affected backend after correcting its configuration.

### CORS Error

If the browser reports a CORS error:

- Check `FRONTEND_ORIGIN` in the Products/Auth API's `.env` file.
- Ensure it includes the frontend origin, such as `http://localhost:5173`.
- Confirm that the backend CORS configuration allows the requesting origin.
- Restart the backend after changing the configuration.

### Frontend Cannot Reach Backend

If API requests fail:

- Confirm that the required backend is running.
- Check `VITE_API_BASE_URL` for the Products/Auth API.
- Check `VITE_TASKS_API_BASE_URL` for the Tasks API.
- Verify the configured ports: Products/Auth API uses `3000`, and Tasks API uses `3001`.
- Restart the Vite development server after changing frontend environment variables.

### 401 Unauthorized

If login or an authenticated request returns `401 Unauthorized`:

- Confirm that the login credentials are correct.
- Check that the request includes a valid authentication token when required.
- Verify that the token has not expired.
- Check `JWT_SECRET` in the Products/Auth API's `.env` file.
- Log in again to obtain a fresh token if necessary.

### Sequelize Connection Failure

If Sequelize cannot connect to the database:

- Check the same database configuration variables used by the Products/Auth API: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.
- Confirm that the database is running and accessible.
- Check the Sequelize configuration and migration status.
- Review the backend terminal output for the specific error before retrying.

Do not share database passwords, JWT secrets, or other credentials when reporting setup errors.