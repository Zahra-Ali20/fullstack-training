
import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../features/cart/cartSlice'


function ProductCard({ product, onSelectProduct }) {
  const dispatch = useDispatch()
  const { name, price, category, inStock } = product

  const isInStock =
    inStock === true || Number(inStock) === 1

  const handleAddToCart = (event) => {
    event.stopPropagation()

    if (!isInStock) return

    dispatch(addToCart(product))
  }

  return (
    <div
      onClick={() => onSelectProduct(product)}
      style={{ cursor: 'pointer' }}
    >
      <h2>{name}</h2>
      <p>Price: ${price}</p>
      <p>Category: {category}</p>

      <p className={isInStock ? 'in-stock' : 'out-of-stock'}>
        {isInStock ? 'In Stock' : 'Out of Stock'}
      </p>

      <button
        onClick={handleAddToCart}
        disabled={!isInStock}
      >
        {isInStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  )
}

export default memo(ProductCard)
