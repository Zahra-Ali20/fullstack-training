
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const tasksRoutes = require("./routes/tasksRoutes");
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
app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
  });
});
app.use("/api/tasks", tasksRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Tasks API is running",
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Tasks API running on port ${PORT}`);
});
