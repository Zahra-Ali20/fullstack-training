
const requiredEnvVars = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "JWT_SECRET",
  "FRONTEND_ORIGIN",
];

function validateEnv() {
  const missingVars = requiredEnvVars.filter((name) => {
    return !process.env[name]?.trim();
  });

  if (missingVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
    process.exit(1);
  }
}

module.exports = validateEnv;

