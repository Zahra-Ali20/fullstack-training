import { useSelector } from 'react-redux'

function CartSummary() {
  const items = useSelector((state) => state.cart.items)

  const uniqueProducts = items.length

  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const cartTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <section>
      <h2>Cart Summary</h2>

      <p>Unique Products: {uniqueProducts}</p>
      <p>Total Quantity: {totalQuantity}</p>
      <p>Cart Total: ${cartTotal.toFixed(2)}</p>
    </section>
  )
}

export default CartSummary