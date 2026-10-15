# Database Design

## Users Table

### Purpose
Stores information about users.

### Primary Key
- `id`

### Important Columns
- `id` — unique identifier for each user
- `name` — user's name
- `email` — user's unique email
- `created_at` — date and time when the user was created

### Foreign Keys
- None

### Relationship
- One user can have many orders.

## Products Table

### Purpose
Stores information about products available in the store.

### Primary Key
- `id`

### Important Columns
- `id` — unique identifier for each product
- `name` — product name
- `price` — current product price
- `category` — product category
- `in_stock` — shows whether the product is available
- `created_at` — date and time when the product was created

### Foreign Keys
- None

### Relationship
- One product can appear in many order items.

## Orders Table

### Purpose
Stores information about orders placed by users.

### Primary Key
- `id`

### Important Columns
- `id` — unique identifier for each order
- `user_id` — identifies the user who placed the order
- `status` — current status of the order
- `created_at` — date and time when the order was created

### Foreign Keys
- `user_id` → `users.id`

### Relationship
- One user can have many orders.
- Each order belongs to one user.
- One order can have many order items.

## Order Items Table

### Purpose
Stores the products included in each order.

### Primary Key
- `id`

### Important Columns
- `id` — unique identifier for each order item
- `order_id` — identifies the order
- `product_id` — identifies the product
- `quantity` — number of units ordered
- `unit_price` — price of one product at the time of the order

### Foreign Keys
- `order_id` → `orders.id`
- `product_id` → `products.id`

### Relationship
- One order can have many order items.
- One product can appear in many order items.
- `order_items` connects orders and products.


## Relationship Diagram


users
  │
  │ 1
  │
  │ many
  ▼
orders
  │
  │ 1
  │
  │ many
  ▼
order_items
  ▲
  │ many
  │
  │ 1
products

## Relationship Summary
One user can have many orders.
One order can have many order items.
One product can appear in many order items.
order_items connects orders and products