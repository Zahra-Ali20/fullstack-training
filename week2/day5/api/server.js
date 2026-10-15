require("dotenv").config();

const express = require("express");
const tasksRoutes = require("./routes/tasksRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

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