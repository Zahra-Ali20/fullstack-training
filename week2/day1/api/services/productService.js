const pool = require("../config/db");

const getAllProducts = async (category) => {
  let query = `
    SELECT
      id,
      name,
      price,
      category,
      in_stock AS inStock,
      created_at AS createdAt
    FROM products
  `;

  const params = [];

  if (category) {
    query += " WHERE LOWER(category) = LOWER(?)";
    params.push(category);
  }

  const [rows] = await pool.query(query, params);

  return rows;
};


const getProductById = async (id) => {
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

  return rows[0] || null;
};


const createProduct = async ({ name, price, category, inStock }) => {
  const [result] = await pool.query(
    `INSERT INTO products (name, price, category, in_stock)
     VALUES (?, ?, ?, ?)`,
    [name, price, category, inStock]
  );

  return {
    id: result.insertId,
    name,
    price,
    category,
    inStock,
  };
};

const updateProduct = async (id, { name, price, category, inStock }) => {
  const [rows] = await pool.query(
    "SELECT * FROM products WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    return null;
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

  return updatedRows[0];
};

const deleteProduct = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM products WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    return false;
  }

  await pool.query(
    "DELETE FROM products WHERE id = ?",
    [id]
  );

  return true;
};


module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,

};