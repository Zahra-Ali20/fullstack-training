
const jwt = require("jsonwebtoken");
const authService = require("../services/authService");

const register = async (req, res, next) => {
  try {
    const user = await authService.register({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await authService.login({
      email: req.body.email.trim().toLowerCase(),
      password: req.body.password,
    });

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login };

