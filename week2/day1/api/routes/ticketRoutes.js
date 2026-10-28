const express = require("express");
const requireRole = require("../middleware/requireRole");

const {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");

const authenticateToken = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const {
  validateTicket,
  validateTicketUpdate,
  validateTicketId,
  validateTicketFilters,
} = require("../validators/ticketValidator");

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  validateTicketFilters,
  validateRequest,
  getAllTickets
);

router.get(
  "/:id",
  authenticateToken,
  validateTicketId,
  validateRequest,
  getTicketById
);


router.post(
  "/",
  authenticateToken,
  validateTicket,
  validateRequest,
  createTicket
);


router.put(
  "/:id",
  authenticateToken,
  validateTicketId,
  validateTicketUpdate,
  validateRequest,
  updateTicket
);

router.delete(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  validateTicketId,
  validateRequest,
  deleteTicket
);

module.exports = router;