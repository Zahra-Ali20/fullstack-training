function ProductDetails({ product }) {

  if (!product) {
    return (
      <div>
        <h2>Selected Product</h2>
        <p>Select a product to view details.</p>
      </div>
    )
  }

  return (
    <div>
      <h2>Selected Product</h2>
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
      <p>Status: {product.inStock ? "In Stock" : "Out of Stock"}</p>
    </div>
  )
}

export default ProductDetails