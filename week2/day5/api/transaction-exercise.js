
require("dotenv").config();

const sequelize = require("./config/sequelize");
const { Order, OrderItem } = require("./models");

async function createOrderWithItems() {
  const transaction = await sequelize.transaction();

  try {
    // Step 1: Create an order
    const order = await Order.create(
      {
        user_id: 1,
        status: "pending",
      },
      { transaction }
    );

    console.log("Order created:", order.id);

    // Step 2: Create first order item
    await OrderItem.create(
      {
        order_id: order.id,
        product_id: 1,
        quantity: 2,
        unit_price: 100.00,
      },
      { transaction }
    );

    console.log("First order item created");

    // Step 3: Create second order item
    await OrderItem.create(
      {
        order_id: order.id,
        product_id: 2,
        quantity: 1,
        unit_price: 250.00,
      },
      { transaction }
    );

    console.log("Second order item created");

    // Step 4: Save all changes
    await transaction.commit();

    console.log("Transaction committed successfully!");
  } catch (error) {
    await transaction.rollback();

    console.error("Transaction rolled back:", error.message);
  } finally {
    await sequelize.close();
  }
}

createOrderWithItems();
