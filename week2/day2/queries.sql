USE fullstack_training;

/*Get All Products */

SELECT *
FROM products;

/*Find Products by Category*/

SELECT *
FROM products
WHERE category = 'Electronics';

/*Find Products Below a Price*/

SELECT *
FROM products
WHERE price < 500
ORDER BY price ASC;

/*Get a User's Orders*/

SELECT
    users.name,
    orders.id AS order_id,
    orders.status,
    orders.created_at
FROM users
JOIN orders
    ON users.id = orders.user_id
WHERE users.id = 1;

/*Part 15: Get Order Details*/

SELECT
    orders.id AS order_id,
    products.name AS product_name,
    order_items.quantity,
    order_items.unit_price
FROM orders
JOIN order_items
    ON orders.id = order_items.order_id
JOIN products
    ON order_items.product_id = products.id
WHERE orders.id = 1;

/* Calculate Line Total*/

SELECT
    orders.id AS order_id,
    products.name AS product_name,
    order_items.quantity,
    order_items.unit_price,
    order_items.quantity * order_items.unit_price AS line_total
FROM orders
JOIN order_items
    ON orders.id = order_items.order_id
JOIN products
    ON order_items.product_id = products.id
WHERE orders.id = 1;


/*Part 17: Calculate Order Total*/

SELECT
    orders.id AS order_id,
    SUM(order_items.quantity * order_items.unit_price) AS order_total
FROM orders
JOIN order_items
    ON orders.id = order_items.order_id
WHERE orders.id = 1
GROUP BY orders.id;

/*  Count Orders Per User */
SELECT
    users.name,
    COUNT(orders.id) AS order_count
FROM users
LEFT JOIN orders
    ON users.id = orders.user_id
GROUP BY users.id, users.name;

/*Part 19: Update a Product*/

UPDATE products
SET price = 35.00
WHERE id = 2;

DELETE FROM products
WHERE id = 1;

/*Part 25: Verify Referential Integrity */

INSERT INTO orders (user_id, status)
VALUES (9999, 'pending');/*MySQL Error (1452): Cannot add or update a child row: a foreign key constraint fails (`fullstack_training`.`orders`, CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`))*/
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (1, 9999, 1, 100.00); /* MySQL Error (1452): Cannot add or update a child row: a foreign key constraint fails (`fullstack_training`.`order_items`, CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`))*/

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (9999, 1, 1, 100.00);MySQL Error (1452): /*Cannot add or update a child row: a foreign key constraint fails (`fullstack_training`.`order_items`, CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`))*/

/* part 26  */
## DELETE Behavior

### Chosen Behavior: RESTRICT

The database should prevent deleting users, orders, or products that are referenced by other records.
This helps preserve order history and prevents accidental deletion of related data.
For example, a user with existing orders should not be deleted until the related orders are handled appropriately.
We do not use `ON DELETE CASCADE` because deleting a parent record could also delete important order history and order items.