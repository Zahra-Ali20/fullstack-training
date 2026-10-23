
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const register = async ({ name, email, password }) => {
  // 1. Check whether email already exists
  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  // 2. Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create user with the normal public role
  try {
    return await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });
  } catch (error) {
    // Handle a duplicate email inserted concurrently
    if (error.name === "SequelizeUniqueConstraintError") {
      const duplicateError = new Error("Email is already registered");
      duplicateError.statusCode = 409;
      throw duplicateError;
    }

    throw error;
  }
};
const login = async ({ email, password }) => {
  // 1. Find user by email
  const user = await User.findOne({
    where: { email },
  });

  // 2. Reject if email does not exist
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // 3. Compare entered password with stored hash
  const passwordMatches = await bcrypt.compare(
    password,
    user.password
  );

  // 4. Reject if password is incorrect
  if (!passwordMatches) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // 5. Return user if credentials are valid
  return user;
};

module.exports = { register,login};
