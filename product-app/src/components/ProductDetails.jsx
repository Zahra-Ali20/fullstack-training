function ProductDetails({ product }) {
  if (!product) {
    return <p>Select a product to view details.</p>
  }

  return (
    <div>
      <h2>{product.name}</h2>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
      <p>{product.inStock ? "In Stock" : "Out of Stock"}</p>
    </div>
  )
}

export default ProductDetails