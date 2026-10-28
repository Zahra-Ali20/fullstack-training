const User = require("./User");
const Task = require("./Task");
const Order = require("./Order");
const OrderItem = require("./OrderItem");

Task.belongsTo(User, {
  as: "Creator",
  foreignKey: "created_by",
});

Task.belongsTo(User, {
  as: "Assignee",
  foreignKey: "assigned_to",
});

User.hasMany(Task, {
  as: "CreatedTasks",
  foreignKey: "created_by",
});

User.hasMany(Task, {
  as: "AssignedTasks",
  foreignKey: "assigned_to",
});

Order.hasMany(OrderItem, {
  as: "Items",
  foreignKey: "order_id",
});

OrderItem.belongsTo(Order, {
  as: "Order",
  foreignKey: "order_id",
});

module.exports = { User, Task, Order, OrderItem };