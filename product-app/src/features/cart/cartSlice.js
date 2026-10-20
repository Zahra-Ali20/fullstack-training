
import { createSlice } from '@reduxjs/toolkit'
import { deleteProduct } from '../products/productsSlice'
const initialState = {
  items: []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,

  reducers: {
    addToCart: (state, action) => {
      const product = action.payload

      const isInStock =
        product.inStock === true || Number(product.inStock) === 1

      if (!isInStock) return

      const existingItem = state.items.find(
        (item) => item.id === product.id
      )

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: 1
        })
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      )
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload

      if (!Number.isInteger(quantity) || quantity < 0) return

      if (quantity === 0) {
        state.items = state.items.filter(
          (item) => item.id !== id
        )
        return
      }

      const item = state.items.find((item) => item.id === id)

      if (item) {
        item.quantity = quantity
      }
    }
  },

  extraReducers: (builder) => {
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.items = state.items.filter(
        (item) => Number(item.id) !== Number(action.payload)
      )
    })
  }
})
export const { addToCart,removeFromCart,updateQuantity} = cartSlice.actions

export default cartSlice.reducer


//Part 33: Deleted Cart Products
/*
**Decision:** When a product is successfully deleted, remove it from the cart as well.

**Implementation:** The cart slice handles `deleteProduct.fulfilled` in `extraReducers` and filters out the deleted product using its ID.

**Reason:** Keeping a permanently deleted product in the cart would create inconsistent application state because the cart would reference a product that no longer exists.

**Failure behavior:** If the delete request fails, the fulfilled action does not run, so the cart item remains unchanged.

*/