const express = require("express");
const {
  validateProduct,
  validateProductId,
} = require("../validators/productValidator");
const validateRequest = require("../middleware/validateRequest");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();
router.get("/", getProducts);

router.get(
  "/:id",
  validateProductId,
  validateRequest,
  getProductById
);

router.post("/", validateProduct, validateRequest, createProduct);
router.put(
  "/:id",
  validateProductId,
  validateProduct,
  validateRequest,
  updateProduct
);
router.delete(
  "/:id",
  validateProductId,
  validateRequest,
  deleteProduct
);
module.exports = router;