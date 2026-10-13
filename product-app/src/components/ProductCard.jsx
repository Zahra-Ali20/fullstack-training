function ProductCard({ product, onSelectProduct }) {
  const { name, price, category, inStock } = product

  return (
    <div
      onClick={() => onSelectProduct(product)}
      style={{ cursor: "pointer" }}
    >
      <h2>{name}</h2>
      <p>Price: ${price}</p>
      <p>Category: {category}</p>
<p className={inStock ? "in-stock" : "out-of-stock"}>
  {inStock ? "In Stock" : "Out of Stock"}
</p>    </div>
  )
}

export default ProductCard