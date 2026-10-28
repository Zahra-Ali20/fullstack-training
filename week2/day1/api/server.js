require("dotenv").config();

const validateEnv = require("./utils/validateEnv");
validateEnv();

const app = require("./app");
const sequelize = require("./config/sequelize");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log("Sequelize database connection established.");

    app.listen(PORT, () => {
      console.log(`Products/Auth API running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Unable to connect to the database. Check database configuration."
    );
    process.exit(1);
  }
}

startServer();