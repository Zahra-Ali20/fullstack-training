# MySQL Integration

## Database Configuration

The database connection settings are stored in the `.env` file. These include the database host, username, password, database name, and port.
The application loads these settings using `dotenv` and uses them to configure the MySQL connection pool.

## Connection Pool

The application creates a shared connection pool in `config/db.js`.
The pool is reused by the product controller for database queries. The `connectionLimit` is set to 10, and the pool manages connections as needed.

## Parameterized Queries

The application uses parameterized queries with `?` placeholders for user-provided values.
This helps prevent SQL injection by separating query values from SQL instructions.

## Persistence Test

Product data is stored in the MySQL database. Data remains available after the Express server restarts because it is stored in the database rather than only in application memory.


