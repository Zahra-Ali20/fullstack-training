const { body, param , query } = require("express-validator");

// Validation for creating a task
const validateTask = [
  body("title")
    .exists({ checkFalsy: true })
    .withMessage("Title is required")
    .bail()
    .isString()
    .withMessage("Title must be a string")
    .bail()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Title must be between 2 and 150 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("status")
    .isIn(["pending", "in_progress", "completed"])
    .withMessage("Invalid task status"),

  body("priority")
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid task priority"),

  body("created_by")
    .exists({ checkFalsy: true })
    .withMessage("created_by is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("created_by must be a positive integer")
    .toInt(),

  body("assigned_to")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("assigned_to must be a positive integer")
    .toInt(),
];

// Validation for updating a task
const validateTaskUpdate = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Task ID must be a positive integer")
    .toInt(),

  body("title")
    .exists({ checkFalsy: true })
    .withMessage("Title is required")
    .bail()
    .isString()
    .withMessage("Title must be a string")
    .bail()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Title must be between 2 and 150 characters"),

  body("description")
    .exists()
    .withMessage("Description field is required")
    .bail()
    .custom((value) => value === null || typeof value === "string")
    .withMessage("Description must be a string or null"),

  body("status")
    .exists({ checkFalsy: true })
    .withMessage("Status is required")
    .bail()
    .isIn(["pending", "in_progress", "completed"])
    .withMessage("Invalid task status"),

  body("priority")
    .exists({ checkFalsy: true })
    .withMessage("Priority is required")
    .bail()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium or high"),

  body("assigned_to")
    .exists()
    .withMessage("assigned_to field is required")
    .bail()
    .custom((value) =>
      value === null ||
      (Number.isInteger(Number(value)) && Number(value) > 0)
    )
    .withMessage("assigned_to must be a positive integer or null")
    .customSanitizer((value) =>
      value === null ? null : Number(value)
    ),
];
const validateTaskId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Task ID must be a positive integer")
    .toInt(),
];

const validateTaskFilters = [
  query("status")
    .optional()
    .isIn(["pending", "in_progress", "completed"])
    .withMessage("Status must be pending, in_progress or completed"),

  query("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium or high"),

  query("assigned_to")
    .optional()
    .isInt({ min: 1 })
    .withMessage("assigned_to must be a positive integer")
    .toInt(),
];
module.exports = {
  validateTask,
  validateTaskUpdate,
  validateTaskId,
  validateTaskFilters,
};