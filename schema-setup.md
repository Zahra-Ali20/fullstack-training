# Part 16: Schema Setup Guide

## Purpose

This guide documents how to create the `fullstack_training` database, apply the base schema, add authentication columns, insert sample data, and verify the required tables.

## 1. Actual Project Files

|        | File |                                            | Purpose |
|
| `week2/day2/schema.sql` | Creates the database and the `users`, `products`, `orders`, and `order_items` tables. |
| `week2/day2/seed.sql` | Inserts sample users, products, orders, and order items. |
| `week2/day2/queries.sql` | Contains example queries and referential-integrity exercises. It is not required for initial setup. |
| `week2/day1/api/migrations/20261022150309-add-password-and-role-to-users.js` | Adds the `password` and `role` columns to `users`. |
| `week2/day5/tasks-schema.sql` | Creates the `tasks` table. |
| `week2/day5/tasks-seed.sql` | Inserts five sample tasks. |

**Tasks SQL file availability:** The Tasks schema and seed files are available in Git commit `a0f71bb`, on the `feature/tasks-api` and `feature/node-services-sequelize` branches. Confirm that these files are present in the working tree before executing them.

## 2. Important Safety Warning

The base schema contains `DROP TABLE IF EXISTS` statements for `order_items`, `orders`, `products`, and `users`.

Run `week2/day2/schema.sql` only when setting up a fresh or disposable database. Running it against an existing database can delete existing tables and their data.

Do not reset a database simply to repeat the setup instructions.

The seed files also insert sample records. Avoid running them repeatedly unless duplicate sample data is intentional or the database has been reset.

## 3. Setup Order

### Step 1: Create the database and base tables

Ensure `week2/day2/schema.sql` is available in the working tree. Execute it using MySQL Workbench or the MySQL command-line client.

This file creates `fullstack_training` and the following tables:

- `users`
- `products`
- `orders`
- `order_items`

The foreign-key relationships require referenced parent tables to exist first. The supplied schema creates these tables in a compatible order.

**Important:** Review the `DROP TABLE IF EXISTS` statements before executing the file. Do not run it against a database containing data you need to preserve.

### Step 2: Apply the authentication migration

The base `users` table does not initially define `password` or `role`. The authentication migration adds these columns.

From the Product/Auth API directory, use:

```bash
cd /Users/zahraali/Documents/FullStack/week2/day1/api
npx sequelize-cli db:migrate
```

The Sequelize CLI loads `config/config.js` and uses the configured migrations directory.

Check the migration status with:

```bash
npx sequelize-cli db:migrate:status
```

**Verified status at the time of writing:** `20261022150309-add-password-and-role-to-users.js` was reported as `up` in the current development database.

For a fresh database, verify the environment configuration and migration history before applying migrations. The base `users` table must exist before this migration runs. Do not apply the equivalent authentication migration from the Tasks API to the same database as well.

### Step 3: Insert base seed data

Ensure `week2/day2/seed.sql` is available in the working tree, then execute it using MySQL Workbench or the MySQL command-line client.

It inserts sample users, products, orders, and order items.

Run it after creating the base tables. The authentication migration can be applied before the seed data, as described in Step 2.

The seed file is intended as sample data, not as a repeatable migration. Running it multiple times may insert duplicate records.

### Step 4: Create the tasks table

Ensure `week2/day5/tasks-schema.sql` is available in the working tree, then execute it using MySQL Workbench or the MySQL command-line client.

The `tasks` table references `users(id)` through `created_by` and `assigned_to`, so the `users` table must exist first.

### Step 5: Insert task seed data

Ensure `week2/day5/tasks-seed.sql` is available in the working tree, then execute it after creating the tasks table.

The seed inserts five sample tasks referencing user IDs `1`, `2`, and `3`. Verify that these users exist before inserting the sample tasks.

Running the task seed repeatedly may create duplicate task records.

## 4. Verification

Run the following queries in MySQL after completing the setup steps:

```sql
USE fullstack_training;

SHOW TABLES;

DESCRIBE users;
DESCRIBE products;
DESCRIBE orders;
DESCRIBE order_items;
DESCRIBE tasks;

SELECT id, name, email, role FROM users;

SELECT COUNT(*) AS product_count FROM products;
SELECT COUNT(*) AS order_count FROM orders;
SELECT COUNT(*) AS order_item_count FROM order_items;
SELECT COUNT(*) AS task_count FROM tasks;

SHOW CREATE TABLE tasks;
```

Expected table names:

- `users`
- `products`
- `orders`
- `order_items`
- `tasks`

The authentication migration should result in `password` and `role` columns in `users`.

The task seed file inserts five sample tasks, provided the inserts complete successfully and the referenced users exist.

The exact row counts may differ if the database already contains data or seed files have been executed previously.

## 5. Schema and Runtime Startup

Database schema setup and application startup are separate operations.

- SQL schema files create tables and constraints.
- Sequelize migrations apply versioned schema changes.
- Seed files insert sample data.
- `sequelize.authenticate()` verifies that the application can connect to the configured database. It does not create tables or apply migrations.

## 6. Current Limitations

- The base schema and seed files are maintained under `week2/day2/` on the `feature/mysql-schema` branch.
- The Tasks SQL files are available in commit `a0f71bb` on the `feature/tasks-api` and `feature/node-services-sequelize` branches.
- The current development database had the authentication migration recorded as `up` when this guide was prepared. This does not prove that a fresh database has been initialized.
- The documented setup depends on retrieving the SQL files if they are not present in the current working tree.
- No dedicated base-schema migration or seed script has been verified for automatically creating every required table.

## 7. Sequelize's Role in the Project

Sequelize is used for database connectivity, model definitions, and versioned schema migrations in parts of the project. It is not the only way the application accesses the database.

- **Product/Auth API:** Uses Sequelize to connect to the configured database and run migrations. The `User` and `Product` Sequelize models are defined in the project.
- **Tasks API:** The current task routes and service layer use `mysql2` with raw SQL queries. Sequelize task models also exist in the project, but the current task routes do not use them for database operations.
- **Raw SQL:** SQL schema files, seed files, and task service queries perform database operations directly where applicable.

Therefore, the project uses **Sequelize alongside raw SQL**, rather than Sequelize for all database operations.

### Important: Do Not Use `sequelize.sync({ force: true })`

Do not use `sequelize.sync({ force: true })` to initialize or reset the existing `fullstack_training` database.

The `force: true` option drops existing tables before recreating them. This can permanently delete existing table data and disrupt foreign-key relationships.

Use the documented SQL schema files to create the base tables in a fresh or disposable database, and use the configured Sequelize migrations for authentication-related schema changes. Check the database configuration and migration status before applying changes.
