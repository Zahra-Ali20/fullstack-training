
require("dotenv").config();
const validateEnv = require("./utils/validateEnv");
validateEnv();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/sequelize");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const allowedOrigins = (
  process.env.FRONTEND_ORIGIN || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 3000;

app.use(errorHandler);

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log("Sequelize database connection established.");

    app.listen(PORT, () => {
      console.log(`Products/Auth API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database. Check database configuration.");
    process.exit(1);
  }
}

startServer();
