const { body, param, query } = require("express-validator");

const validateTicket = [
  body("title")
    .exists({ values: "undefined" })
    .withMessage("Title is required")
    .bail()
    .isString()
    .withMessage("Title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isLength({ min: 2, max: 150 })
    .withMessage("Title must be between 2 and 150 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("status")
    .optional()
    .isIn(["open", "in_progress", "resolved", "closed"])
    .withMessage("Status is invalid"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority is invalid"),

  body("assigned_to")
    .optional({ values: "null" })
    .isInt({ min: 1 })
    .withMessage("Assigned user ID must be a positive integer"),
];

const validateTicketUpdate = [
  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .bail()
    .isLength({ min: 2, max: 150 })
    .withMessage("Title must be between 2 and 150 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("status")
    .optional()
    .isIn(["open", "in_progress", "resolved", "closed"])
    .withMessage("Status is invalid"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority is invalid"),

  body("assigned_to")
    .optional({ values: "null" })
    .isInt({ min: 1 })
    .withMessage("Assigned user ID must be a positive integer"),
];

const validateTicketId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Ticket ID must be a positive integer"),
];

const validateTicketFilters = [
  query("status")
    .optional()
    .isIn(["open", "in_progress", "resolved", "closed"])
    .withMessage("Status filter is invalid"),

  query("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority filter is invalid"),
];

module.exports = {
  validateTicket,
  validateTicketUpdate,
  validateTicketId,
  validateTicketFilters,
};