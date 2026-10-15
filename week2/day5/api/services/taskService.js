
const pool = require("../config/db");
const AppError = require("../utils/AppError");

const getAllTasks = async ({ status, priority, assigned_to } = {}) => {
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
    JOIN users AS creator ON tasks.created_by = creator.id
    LEFT JOIN users AS assignee ON tasks.assigned_to = assignee.id
  `;

  if (conditions.length) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql += " ORDER BY tasks.created_at DESC";

  const [rows] = await pool.query(sql, values);
  return rows;
};

const getTaskById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM tasks WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    throw new AppError("Task not found", 404);
  }

  return rows[0];
};

const createTask = async ({
  title,
  description,
  status,
  priority,
  created_by,
  assigned_to,
}) => {
  const [creator] = await pool.query(
    "SELECT id FROM users WHERE id = ?",
    [created_by]
  );

  if (creator.length === 0) {
    throw new AppError("Creator user not found", 404);
  }

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
      description ?? null,
      status,
      priority,
      created_by,
      assigned_to ?? null,
    ]
  );

  return {
    message: "Task created successfully",
    taskId: result.insertId,
  };
};

const updateTask = async (
  id,
  { title, description, status, priority, assigned_to }
) => {
  const [existingTask] = await pool.query(
    "SELECT id FROM tasks WHERE id = ?",
    [id]
  );

  if (existingTask.length === 0) {
    throw new AppError("Task not found", 404);
  }

  if (assigned_to != null) {
    const [assignee] = await pool.query(
      "SELECT id FROM users WHERE id = ?",
      [assigned_to]
    );

    if (assignee.length === 0) {
      throw new AppError("Assigned user not found", 404);
    }
  }

  await pool.query(
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

  return {
    message: "Task updated successfully",
    taskId: Number(id),
  };
};

const deleteTask = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM tasks WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new AppError("Task not found", 404);
  }

  return true;
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
