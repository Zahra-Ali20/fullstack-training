# Part 32: Raw SQL vs Sequelize

## Introduction

Raw SQL and Sequelize are two different ways to interact with a database.

- **Raw SQL:** We write SQL queries ourselves to perform database operations.
- **Sequelize:** We use JavaScript models and methods to perform database operations. Sequelize generates SQL queries behind the scenes.

Both approaches can be useful depending on the application, query complexity, performance requirements, and team experience.

## 1. Find a Product

### Raw SQL

```js
const [rows] = await pool.query(
  "SELECT * FROM products WHERE id = ?",
  [productId]
);

const product = rows[0];
```

### Sequelize

```js
const Product = require("./models/Product");

const product = await Product.findByPk(productId);
```

### Comparison

With raw SQL, we write the `SELECT` query and pass the product ID as a parameter. We then access the first result using `rows[0]`.

With Sequelize, `findByPk()` searches for a record using its primary key. Sequelize generates the SQL query and returns a model instance or `null` if no record exists.

## 2. Create a Product

### Raw SQL

```js
const [result] = await pool.query(
  `INSERT INTO products (name, price, category, in_stock)
   VALUES (?, ?, ?, ?)`,
  ["Keyboard", 2500, "Electronics", true]
);

console.log("Created product ID:", result.insertId);
```

### Sequelize

```js
const Product = require("./models/Product");

const product = await Product.create({
  name: "Keyboard",
  price: 2500,
  category: "Electronics",
  in_stock: true,
});

console.log("Created product ID:", product.id);
```

### Comparison

With raw SQL, we write the `INSERT` statement, specify the columns and values, and retrieve the new ID using `result.insertId`.

With Sequelize, we provide the values as a JavaScript object. The `create()` method generates the insert query and returns the created model instance.

In both examples, the values are hardcoded only for demonstration. In a real API, values would usually come from validated request data, such as `req.body`.

## 3. Fetch Tasks With Users

A task has a creator and may also have an assignee. We want to fetch task information along with the related users.

### Raw SQL

```js
const [rows] = await pool.query(`
  SELECT
    t.*,
    creator.id AS created_by_id,
    creator.name AS created_by_name,
    assignee.id AS assigned_to_id,
    assignee.name AS assigned_to_name
  FROM tasks AS t
  JOIN users AS creator
    ON t.created_by = creator.id
  LEFT JOIN users AS assignee
    ON t.assigned_to = assignee.id
`);
```

### Sequelize

```js
const { Task, User } = require("./models");

const tasks = await Task.findAll({
  include: [
    {
      model: User,
      as: "Creator",
      attributes: ["id", "name", "email"],
    },
    {
      model: User,
      as: "Assignee",
      attributes: ["id", "name", "email"],
      required: false,
    },
  ],
});
```

### Comparison

With raw SQL, we explicitly write `JOIN` and `LEFT JOIN` to connect tasks with their related users.

With Sequelize, we define associations between `Task` and `User` models and use `include` to retrieve related data.

The `as` values must match the aliases defined in our associations. `required: false` allows tasks without an assignee to remain in the results. Their `Assignee` value will be `null`.

Both approaches retrieve related data, but the returned structures differ. Raw SQL returns rows with selected columns, while Sequelize returns model instances containing associated objects.

## Advantages and Disadvantages

### Raw SQL

**Advantages**
- Provides direct control over SQL queries.
- Makes the database operations and joins explicit.
- Can be easier to inspect and optimize for complex queries.
- Supports database-specific SQL features.

**Disadvantages**
- Requires writing and maintaining more SQL code.
- Often requires manually mapping query results.
- Repeated CRUD operations can produce repetitive code.
- Query construction and parameter handling require care.

### Sequelize ORM

**Advantages**
- Provides a higher-level abstraction through JavaScript models.
- Offers convenient methods for common CRUD operations.
- Supports model associations and eager loading through `include`.
- Reduces repetitive SQL for routine database operations.
- Can improve consistency when models and associations are configured properly.

**Disadvantages**
- Requires knowledge of Sequelize models, associations, and options.
- Can hide the SQL generated behind JavaScript methods.
- Incorrect queries or association settings can result in inefficient database operations.
- Complex queries may require raw SQL or careful ORM configuration.
- Generated SQL may need inspection when performance becomes an issue.

## Conclusion

Neither Raw SQL nor Sequelize is always the better choice.

Raw SQL is useful when we need precise control over queries, database-specific features, or complex query optimization.

Sequelize is useful when we want model-based database access, convenient CRUD methods, and relationships represented through associations.

The right choice depends on the application's requirements, query complexity, performance needs, and the team's knowledge. Some applications can also use both approaches where each is most appropriate.


## Part 35: Understand Database Migrations

A database migration is a controlled and versioned change to the database schema. It keeps a history of how the database structure changes over time.

For example:

1. Migration 1: Create the `users` table.
2. Migration 2: Create the `products` table.
3. Migration 3: Create the `tasks` table.
4. Migration 4: Add a `due_date` column to the `tasks` table.

### Example: Adding a Column

Suppose our existing `tasks` table does not have a `due_date` column. We can use the following SQL statement as part of a migration:

```sql
ALTER TABLE tasks
ADD COLUMN due_date DATE NULL;
```

This adds a new column to the existing table without dropping and recreating the entire table. Existing task records are preserved, and their new `due_date` values can be `NULL`.

### Why Are Migrations Important?

- They maintain a history of database schema changes.
- They help developers apply changes in a controlled order.
- They make it easier to keep development, testing, and production databases consistent.
- They allow teams to review changes before applying them.
- They can support rollback procedures when a change is reversible.

### Migrations vs. `sequelize.sync()`

`sequelize.sync()` can create database tables based on Sequelize models. However, using synchronization as the only method for managing production schema changes does not provide the same controlled migration history.

Using `sequelize.sync({ force: true })` can drop and recreate tables for registered models, which may cause existing records to be lost.

Migrations allow developers to define specific schema changes, such as adding a column or creating a table, instead of relying on destructive table recreation. However, migrations must still be reviewed carefully because an incorrectly designed migration can also cause data loss.

### Conclusion

Sequelize models describe how our application interacts with database tables, while migrations manage controlled changes to the database schema over time.

Since our `fullstack_training` database already contains tables, we should map our Sequelize models to the existing tables and avoid destructive synchronization options. In a production application, schema changes should generally be managed through reviewed migrations.