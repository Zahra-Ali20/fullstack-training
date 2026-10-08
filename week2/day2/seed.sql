Use fullstack_training;

Insert into users(name,email)
Value  ('Ali', 'ali@example.com'),
    ('Sara', 'sara@example.com'),
    ('Ahmed', 'ahmed@example.com');

INSERT INTO products (name, price, category, in_stock)
VALUES
    ('Laptop', 1200.00, 'Electronics', TRUE),
    ('Mouse', 30.00, 'Electronics', TRUE),
    ('Keyboard', 50.00, 'Electronics', TRUE),
    ('Office Chair', 150.00, 'Furniture', TRUE),
    ('Notebook', 10.00, 'Stationery', FALSE);

INSERT INTO orders (user_id, status)
VALUES
    (1, 'pending'),
    (1, 'shipped'),
    (2, 'delivered');

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES
    (1, 1, 1, 1200.00),
    (1, 3, 1, 50.00),
    (2, 2, 2, 30.00),
    (3, 1, 1, 1200.00),
    (3, 4, 1, 150.00),
    (3, 5, 2, 10.00);