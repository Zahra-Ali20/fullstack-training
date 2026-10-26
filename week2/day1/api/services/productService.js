
const Product = require("../models/Product");

const getAllProducts = async (category) => {
  const where = {};

  if (category) {
    where.category = category;
  }

  return Product.findAll({ where });
};

const getProductById = async (id) => {
  return Product.findByPk(id);
};

const createProduct = async ({ name, price, category, inStock }) => {
  return Product.create({
    name: name.trim(),
    price,
    category: category.trim(),
    in_stock: inStock,
  });
};

const updateProduct = async (id, { name, price, category, inStock }) => {
  const product = await Product.findByPk(id);

  if (!product) {
    return null;
  }

  await product.update({
    name: name.trim(),
    price,
    category: category.trim(),
    in_stock: inStock,
  });

  return product;
};

const deleteProduct = async (id) => {
  const deletedCount = await Product.destroy({
    where: { id },
  });

  return deletedCount > 0;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
