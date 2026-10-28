const ticketService = require("../services/ticketService");

const getAllTickets = async (req, res, next) => {
  try {
    const tickets = await ticketService.getAllTickets(req.query);

    return res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    const ticket = await ticketService.getTicketById(
      Number(req.params.id)
    );

    if (!ticket) {
      return res.status(404).json({
        error: "Ticket not found",
      });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

const createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.createTicket({
      ...req.body,
      created_by: req.user.id,
    });

    return res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

const updateTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.updateTicket(
      Number(req.params.id),
      req.body,
      req.user
    );

    if (!ticket) {
      return res.status(404).json({
        error: "Ticket not found",
      });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

const deleteTicket = async (req, res, next) => {
  try {
    const deleted = await ticketService.deleteTicket(
      Number(req.params.id)
    );

    if (!deleted) {
      return res.status(404).json({
        error: "Ticket not found",
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
};