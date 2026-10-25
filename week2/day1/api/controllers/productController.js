const AppError = require("../utils/AppError");
const productService = require("../services/productService");

const getProducts = async (req, res, next) => {
  try {
    const category = req.query.category;

    const products = await productService.getAllProducts(category);

    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};



const getProductById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const product = await productService.getProductById(id);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};


const createProduct = async (req, res, next) => {
  try {
const {
  name,
  price,
  category,
  inStock = req.body.in_stock,
} = req.body;
    if (!name) {
      throw new AppError("Name is required", 400);
    }

    if (price === undefined || price === null || price === "") {
      throw new AppError("Price is required", 400);
    }

    if (
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      throw new AppError(
        "Price must be a valid non-negative number",
        400
      );
    }

    if (!category) {
      throw new AppError("Category is required", 400);
    }

    const newProduct = await productService.createProduct({
      name,
      price,
      category,
      inStock,
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};


const updateProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
const {
  name,
  price,
  category,
  inStock = req.body.in_stock,
} = req.body;
    const updatedProduct = await productService.updateProduct(id, {
      name,
      price,
      category,
      inStock,
    });

    if (!updatedProduct) {
      throw new AppError("Product not found", 404);
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};


const deleteProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const deleted = await productService.deleteProduct(id);

    if (!deleted) {
      throw new AppError("Product not found", 404);
    }

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