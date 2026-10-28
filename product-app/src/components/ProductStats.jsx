function ProductStats({ products }) {
  const totalProducts = products.length;

  const inStockCount = products.filter(
    (product) => Number(product.inStock) === 1
  ).length;

  const outOfStockCount = products.filter(
    (product) => Number(product.inStock) === 0
  ).length;

  const totalPrice = products.reduce((sum, product) => {
    return sum + Number(product.price);
  }, 0);

  const averagePrice =
    totalProducts > 0 ? totalPrice / totalProducts : 0;

  return (
    <div>
      <h2>Product Stats</h2>

      <p>Total Products: {totalProducts}</p>
      <p>In Stock: {inStockCount}</p>
      <p>Out of Stock: {outOfStockCount}</p>
      <p>Average Price: ${averagePrice.toFixed(2)}</p>
    </div>
  );
}

export default ProductStats;