
const { Task, User } = require("./models");

async function getTasks() {
  try {
    const tasks = await Task.findAll({
      include: [
        {
          model: User,
          as: "Creator",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "Assignee",
          attributes: ["id", "name", "email"],
          required: false,
        },
      ],
    });

    console.dir(
      tasks.map((task) => task.toJSON()),
      { depth: null }
    );
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
  } finally {
    await require("./config/sequelize").close();
  }
}

getTasks();
