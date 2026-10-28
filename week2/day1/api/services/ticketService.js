const AppError = require("../utils/AppError");
const { Ticket, User } = require("../models");

const getAllTickets = async ({ status, priority } = {}) => {
  const where = {};

  if (status !== undefined) {
    where.status = status;
  }

  if (priority !== undefined) {
    where.priority = priority;
  }

  return Ticket.findAll({
    where,
    include: [
      {
        association: "Creator",
        attributes: ["id", "name", "email"],
        required: false,
      },
      {
        association: "Assignee",
        attributes: ["id", "name", "email"],
        required: false,
      },
    ],
    order: [["created_at", "DESC"]],
  });
};

const getTicketById = async (id) => {
  return Ticket.findByPk(id, {
    include: [
      {
        association: "Creator",
        attributes: ["id", "name", "email"],
        required: false,
      },
      {
        association: "Assignee",
        attributes: ["id", "name", "email"],
        required: false,
      },
    ],
  });
};

const createTicket = async ({
  title,
  description,
  status,
  priority,
  created_by,
  assigned_to,
}) => {
  if (assigned_to !== undefined && assigned_to !== null) {
    const assignee = await User.findByPk(assigned_to);

    if (!assignee) {
      throw new AppError("Assignee user not found", 422);
    }
  }

  return Ticket.create({
    title: title.trim(),
    description: description ?? null,
    status: status ?? "open",
    priority: priority ?? "medium",
    created_by,
    assigned_to: assigned_to ?? null,
  });
};

const updateTicket = async (id, data, user) => {
  if (!user || !user.id || !user.role) {
    throw new AppError("Authentication required", 401);
  }

  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data)
  ) {
    throw new AppError("Invalid update data", 422);
  }

  if (
    Object.prototype.hasOwnProperty.call(data, "id") ||
    Object.prototype.hasOwnProperty.call(data, "created_by")
  ) {
    throw new AppError(
      "Ticket id and created_by cannot be changed",
      403
    );
  }

  const ticket = await Ticket.findByPk(id);

  if (!ticket) {
    return null;
  }

  const isAdmin = user.role === "admin";
  const isAssignedUser =
    Number(ticket.assigned_to) === Number(user.id);

  if (!isAdmin && !isAssignedUser) {
    throw new AppError(
      "You are not allowed to update this ticket",
      403
    );
  }

  if (!isAdmin) {
    const requestedFields = Object.keys(data);
    const hasOnlyStatus =
      requestedFields.length === 1 &&
      requestedFields[0] === "status";

    if (!hasOnlyStatus) {
      throw new AppError(
        "Assigned users may only change ticket status",
        403
      );
    }
  }

  const updates = {};

  if (data.status !== undefined) {
    updates.status = data.status;
  }

  if (isAdmin) {
    if (data.title !== undefined) {
      updates.title = data.title.trim();
    }

    if (data.description !== undefined) {
      updates.description = data.description;
    }

    if (data.priority !== undefined) {
      updates.priority = data.priority;
    }

    if (data.assigned_to !== undefined) {
      updates.assigned_to = data.assigned_to;
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new AppError(
      "No valid fields provided for update",
      422
    );
  }

  await ticket.update(updates);

  return ticket;
};

const deleteTicket = async (id) => {
  const deletedCount = await Ticket.destroy({
    where: { id },
  });

  return deletedCount > 0;
};

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
};