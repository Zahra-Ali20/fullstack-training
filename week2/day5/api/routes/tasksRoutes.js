
const express = require("express");

const router = express.Router();
const validateRequest = require("../middleware/validateRequest");
const {
  validateTask,
  validateTaskUpdate,
  validateTaskId,
  validateTaskFilters,
} = require("../validators/tasksValidator");

const { getAllTasks,getTaskById,createTask,updateTask,deleteTask} = require("../controllers/tasksController");
router.get("/", validateTaskFilters, validateRequest, getAllTasks);

router.get("/:id", validateTaskId, validateRequest, getTaskById);
router.post("/",validateTask,validateRequest,createTask);

router.put("/:id", validateTaskUpdate, validateRequest, updateTask);
router.delete("/:id", validateTaskId, validateRequest, deleteTask);
module.exports = router;
