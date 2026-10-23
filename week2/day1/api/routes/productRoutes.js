
const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

const {
  validateProduct,
  validateProductId,
} = require("../middleware/productValidator");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// Any authenticated user can read products.
router.get("/", authenticateToken, getProducts);

router.get(
  "/:id",
  authenticateToken,
  validateProductId,
  getProductById
);

// Managers and admins can create or update products.
router.post(
  "/",
  authenticateToken,
  requireRole("manager", "admin"),
  validateProduct,
  createProduct
);

router.put(
  "/:id",
  authenticateToken,
  requireRole("manager", "admin"),
  validateProductId,
  validateProduct,
  updateProduct
);

// Only admins can delete products.
router.delete(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  validateProductId,
  deleteProduct
);

module.exports = router;
