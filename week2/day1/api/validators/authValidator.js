
const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;

  // Name validation
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      message: "Name is required",
    });
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2 || trimmedName.length > 100) {
    return res.status(400).json({
      message: "Name must be between 2 and 100 characters",
    });
  }

  // Email validation
  if (typeof email !== "string" || !email.trim()) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({
      message: "Please provide a valid email address",
    });
  }

  // Password validation
  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long",
    });
  }

  // Pass cleaned values to the next middleware
  req.body.name = trimmedName;
  req.body.email = normalizedEmail;

  next();
};

module.exports = validateRegistration;
