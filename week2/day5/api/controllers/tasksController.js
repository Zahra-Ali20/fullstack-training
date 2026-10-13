
const pool = require("../config/db");
const AppError = require("../utils/AppError");
const getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, assigned_to } = req.query;

    const conditions = [];
    const values = [];

    if (status) {
      conditions.push("tasks.status = ?");
      values.push(status);
    }

    if (priority) {
      conditions.push("tasks.priority = ?");
      values.push(priority);
    }

    if (assigned_to) {
      conditions.push("tasks.assigned_to = ?");
      values.push(assigned_to);
    }

    let sql = `
      SELECT
        tasks.id,
        tasks.title,
        tasks.description,
        tasks.status,
        tasks.priority,
        tasks.created_at,
        tasks.updated_at,
        creator.id AS created_by_id,
        creator.name AS created_by_name,
        assignee.id AS assigned_to_id,
        assignee.name AS assigned_to_name
      FROM tasks
      JOIN users AS creator
        ON tasks.created_by = creator.id
      LEFT JOIN users AS assignee
        ON tasks.assigned_to = assignee.id
    `;

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += " ORDER BY tasks.created_at DESC";

    const [rows] = await pool.query(sql, values);

    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
  return res.status(422).json({
    error: "Invalid task ID",
  });
}

    const [rows] = await pool.query(
      "SELECT * FROM tasks WHERE id = ?",
      [id]
    );

   if (rows.length === 0) {
  throw new AppError("Task not found", 404);
}

    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};



const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      created_by,
      assigned_to,
    } = req.body;

    // Check whether the creator exists
    const [creator] = await pool.query(
      "SELECT id FROM users WHERE id = ?",
      [created_by]
    );

    if (creator.length === 0) {
      throw new AppError("Creator user not found", 404);
    }

    // Check whether the assigned user exists
    if (assigned_to != null) {
      const [assignee] = await pool.query(
        "SELECT id FROM users WHERE id = ?",
        [assigned_to]
      );

      if (assignee.length === 0) {
        throw new AppError("Assigned user not found", 404);
      }
    }

    
    const [result] = await pool.query(
      `INSERT INTO tasks
       (title, description, status, priority, created_by, assigned_to)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        status,
        priority,
        created_by,
        assigned_to ?? null,
      ]
    );

    res.status(201).json({
      message: "Task created successfully",
      taskId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};


const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      status,
      priority,
      assigned_to,
    } = req.body;

    // Check whether the task exists
    const [existingTask] = await pool.query(
      "SELECT id FROM tasks WHERE id = ?",
      [id]
    );

    if (existingTask.length === 0) {
      throw new AppError("Task not found", 404);
    }

    // Check whether the assigned user exists
    if (assigned_to != null) {
      const [assignee] = await pool.query(
        "SELECT id FROM users WHERE id = ?",
        [assigned_to]
      );

      if (assignee.length === 0) {
        throw new AppError("Assigned user not found", 404);
      }
    }

    // Update editable task fields only
    const [result] = await pool.query(
      `UPDATE tasks
       SET title = ?,
           description = ?,
           status = ?,
           priority = ?,
           assigned_to = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        title,
        description ?? null,
        status,
        priority,
        assigned_to ?? null,
        id,
      ]
    );

    res.status(200).json({
      message: "Task updated successfully",
      taskId: Number(id),
    });
  } catch (error) {
    next(error);
  }
}

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM tasks WHERE id = ?",
      [id]
    );

   if (result.affectedRows === 0) {
  throw new AppError("Task not found", 404);
}

   return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask ,
  deleteTask
};
