
function ProductDetails({ product, onEdit, onDelete, isDeleting }) {
  if (!product) {
    return <p>Select a product to view details.</p>
  }

  const isInStock = Number(product.inStock) === 1

  return (
    <div>
      <h2>{product.name}</h2>

      <p>Price: ${product.price}</p>

      <p>Category: {product.category}</p>

      <p>
        Stock Status: {isInStock ? 'In Stock' : 'Out of Stock'}
      </p>

      {onEdit && (
        <button type="button" onClick={() => onEdit(product)}>
          Edit
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(product.id)}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      )}
    </div>
  )
}

export default ProductDetails
