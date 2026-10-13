require("dotenv").config();
const express = require("express");
const productRoutes = require("./routes/productRoutes");
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");
const app = express();
app.use(express.json());

app.use(requestLogger);
app.use("/api/products", productRoutes);
// Unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

