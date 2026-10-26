const express = require("express");
const validateRegistration = require("../validators/authValidator");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  validateRegistration,
  authController.register
);

router.post("/login", authController.login);

module.exports = router;