
require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(express.json());

// Allow requests from both frontend development ports.
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Authentication routes: register and login.
app.use("/api/auth", authRoutes);

// Product CRUD routes.
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 3000;
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Products/Auth API running on port ${PORT}`);
});
