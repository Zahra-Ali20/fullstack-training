import React from 'react'

function ProductStats({products}) {
      const totalProducts = products.length;
      const inStock = products.filter((product) => product.inStock === true);
      const inStockCount = inStock.length;
      const outOfStock = products.filter((product) => product.inStock === false);
       const outOfStockCount = outOfStock.length;
       const totalPrice = products.reduce((sum, product) => {
  return sum + product.price;
}, 0);
const averagePrice = totalPrice / products.length;


  return (
    <div>
  <div>
    <h2>Product Stats</h2>

    <p>Total Products: {totalProducts}</p>
    <p>In Stock: {inStockCount}</p>
    <p>Out of Stock: {outOfStockCount}</p>
    <p>Average Price: ${averagePrice}</p>
  </div>

    </div>
  )
}

export default ProductStats
