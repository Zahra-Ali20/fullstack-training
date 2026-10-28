import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "../features/cart/cartSlice";

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  return (
    <section>
      <h2>Shopping Cart</h2>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        items.map((item) => (
          <div key={item.id}>
            <h3>{item.name}</h3>
            <p>Price: ${item.price}</p>
            <label>
              Quantity:
              <input
                type="number"
                min="0"
                step="1"
                value={item.quantity}
                onChange={(event) => {
                  const quantity = Number(event.target.value);

                  dispatch(
                    updateQuantity({
                      id: item.id,
                      quantity,
                    }),
                  );
                }}
              />
            </label>{" "}
            <p>Subtotal: ${item.price * item.quantity}</p>
            <button onClick={() => dispatch(removeFromCart(item.id))}>
              Remove
            </button>
          </div>
        ))
      )}
    </section>
  );
}

export default Cart;
