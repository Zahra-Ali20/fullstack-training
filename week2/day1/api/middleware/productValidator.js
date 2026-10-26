
const validateProduct = (req, res, next) => {
  const { name, price, category } = req.body;

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      error: "Name is required"
    });
  }

    if (
    price === undefined ||
    price === null ||
    price === "" ||
    !Number.isFinite(Number(price)) ||
    Number(price) < 0
  ) {
    return res.status(400).json({
      error: "Price must be a non-negative number"
    });
  }
  if (typeof category !== "string" || !category.trim()) {
    return res.status(400).json({
      error: "Category is required"
    });
  }

  next();
};
const validateProductId = (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      error: "Product ID must be a positive integer"
    });
  }

  next();
};
module.exports = {
  validateProduct,
  validateProductId,
};
