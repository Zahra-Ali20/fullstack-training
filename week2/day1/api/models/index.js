
const User = require("./User");
const Product = require("./Product");
const Ticket = require("./Ticket");

Ticket.belongsTo(User, {
  as: "Creator",
  foreignKey: "created_by",
});

Ticket.belongsTo(User, {
  as: "Assignee",
  foreignKey: "assigned_to",
});

User.hasMany(Ticket, {
  as: "CreatedTickets",
  foreignKey: "created_by",
});

User.hasMany(Ticket, {
  as: "AssignedTickets",
  foreignKey: "assigned_to",
});

module.exports = { User, Product, Ticket };
