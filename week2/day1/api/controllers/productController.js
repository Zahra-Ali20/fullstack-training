const pool = require("../config/db");
const AppError = require("../utils/AppError");
const getProducts = async (req, res, next) => {
try {
const category = req.query.category;
let rows;
if (category) {
  const [products] = await pool.query(
    `SELECT
      id,
      name,
      price,
      category,
      in_stock AS inStock,
      created_at AS createdAt
    FROM products
    WHERE LOWER(category) = LOWER(?)`,
    [category]
  );

  rows = products;
} else {
  const [products] = await pool.query(
    `SELECT
      id,
      name,
      price,
      category,
      in_stock AS inStock,
      created_at AS createdAt
    FROM products`
  );

  rows = products;
}

res.status(200).json(rows);
} catch (error) {
next(error);
}
};

const getProductById = async (req, res, next) => {
try {
const id = Number(req.params.id);
const [rows] = await pool.query(
  `SELECT
    id,
    name,
    price,
    category,
    in_stock AS inStock,
    created_at AS createdAt
  FROM products
  WHERE id = ?`,
  [id]
);

if (rows.length === 0) {
  return next(new AppError("Product not found", 404));
}
res.status(200).json(rows[0]);
} catch (error) {
next(error);
}
};

const createProduct= async(req, res,next) => {
  const { name, price, category, inStock } = req.body;
  if (!name) {
  return res.status(400).json({
    error: "Name is required"
  });
}


if (price === undefined || price === null || price === "") {
  return res.status(400).json({
    error: "Price is required"
  });
}

if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
  return res.status(400).json({
    error: "Price must be a valid non-negative number"
  });
}

if (!category) {
  return res.status(400).json({
    error: "Category is required"
  });
}
try {
  const [result] = await pool.query(
    "INSERT INTO products (name, price, category, in_stock) VALUES (?, ?, ?, ?)",
    [name, price, category, inStock]
  );
  const newProduct = {
  id: result.insertId,
  name,
  price,
  category,
  inStock
};

return res.status(201).json(newProduct);
  } 
   catch (error) {
    next(error);
  }};
const updateProduct = async (req, res, next) => {
try {
const id = Number(req.params.id);
const { name, price, category, inStock } = req.body;
const [rows] = await pool.query(
  "SELECT * FROM products WHERE id = ?",
  [id]
);
if (rows.length === 0) {
  return next(new AppError("Product not found", 404));
}

await pool.query(
  `UPDATE products
   SET name = ?, price = ?, category = ?, in_stock = ?
   WHERE id = ?`,
  [name, price, category, inStock, id]
);

const [updatedRows] = await pool.query(
  `SELECT
    id,
    name,
    price,
    category,
    in_stock AS inStock,
    created_at AS createdAt
   FROM products
   WHERE id = ?`,
  [id]
);

return res.status(200).json(updatedRows[0]);
} catch (error) {
next(error);
}
};
const deleteProduct = async (req, res, next) => {
try {
const id = Number(req.params.id);
const [rows] = await pool.query(
  "SELECT * FROM products WHERE id = ?",
  [id]
);

if (rows.length === 0) {
  return next(new AppError("Product not found", 404));
}

await pool.query(
  "DELETE FROM products WHERE id = ?",
  [id]
);

return res.status(204).send();
} catch (error) {
next(error);
}
};
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};