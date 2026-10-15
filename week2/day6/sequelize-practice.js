const Product = require("./../day1/api/models/Product");

async function main() {
  try {
    // Create
    const newProduct = await Product.create({
      name: "Sequelize Practice Product",
      price: "250.00",
      category: "Learning",
      in_stock: true,
    });

    console.log("Created Product:");
    console.log(newProduct.toJSON());

    // Update
    const [updatedRows] = await Product.update(
      {
        price: "300.00",
        category: "Accessories",
      },
      {
        where: { id: newProduct.id },
      }
    );

    console.log("Updated rows:", updatedRows);

    const updatedProduct = await Product.findByPk(newProduct.id);

    console.log("Updated Product:");
    console.log(
      updatedProduct ? updatedProduct.toJSON() : "Product not found"
    );

    // Delete
    const deletedRows = await Product.destroy({
      where: { id: newProduct.id },
    });

    console.log("Deleted rows:", deletedRows);

    const deletedProduct = await Product.findByPk(newProduct.id);

    console.log(
      "Product after delete:",
      deletedProduct ? deletedProduct.toJSON() : "Product not found"
    );
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await Product.sequelize.close();
  }
}

main();