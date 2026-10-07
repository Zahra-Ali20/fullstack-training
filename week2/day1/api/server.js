
const express = require("express");

const app = express();
app.use(express.json());
app.get("/api/products", (req, res) => {
  const category = req.query.category;

  if (!category) {
    return res.json(products);
  }

  const filteredProducts = products.filter(
    (product) =>
      product.category.toLowerCase() === category.toLowerCase()
  );

  res.json(filteredProducts);
});

app.get("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
    const product = products.find((p) => p.id === id);
  if (!product) {
  return res.status(404).json({
    error: "Product not found"
  });
}
res.json(product);
});

app.post("/api/products", (req, res) => {
  const { name, price, category, inStock } = req.body;
  if (!name) {
  return res.status(400).json({
    error: "Name is required"
  });
}

if (price === undefined) {
  return res.status(400).json({
    error: "Price is required"
  });
}

if (!category) {
  return res.status(400).json({
    error: "Category is required"
  });
}
    const id = products.length + 1;
  const newProduct = {
  id,
  name,
  price,
  category,
  inStock
};
products.push(newProduct);
  res.status(201).json(newProduct);

}
);
app.put("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({
      error: "Product not found"
    });
  }

  Object.assign(product, req.body);

  res.json(product);
});
app.delete("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "Product not found"
    });
  }

  products.splice(index, 1);

  res.json({
    message: "Product deleted successfully"
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal server error"
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

const products = [
  {
    id: 1,
    name: "Laptop",
    price: 1200,
    category: "Electronics",
    inStock: true
  },
  {
    id: 2,
    name: "Mouse",
    price: 30,
    category: "Electronics",
    inStock: true
  },
  {
    id: 3,
    name: "Office Chair",
    price: 150,
    category: "Furniture",
    inStock: true
  },
  {
    id: 4,
    name: "Notebook",
    price: 10,
    category: "Stationery",
    inStock: false
  },
  {
    id: 5,
    name: "Headphones",
    price: 80,
    category: "Electronics",
    inStock: true
  }
];