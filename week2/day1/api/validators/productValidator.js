const { body, param } = require("express-validator");
const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .bail()
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ max: 50 })
    .withMessage("Category must not exceed 50 characters"),

  body("inStock")
    .optional()
    .isBoolean()
    .withMessage("inStock must be a boolean"),
];
const validateProductId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a positive integer"),
];

module.exports = {
  validateProduct,
  validateProductId,
};