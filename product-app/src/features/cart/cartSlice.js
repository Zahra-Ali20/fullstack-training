
import { createSlice } from '@reduxjs/toolkit'

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

      if (!isInStock) {
        return
      }

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
},    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload

      if (!Number.isInteger(quantity) || quantity < 0) {
        return
      }

      if (quantity === 0) {
        state.items = state.items.filter(
          (item) => item.id !== id
        )
        return
      }

      const item = state.items.find(
        (item) => item.id === id
      )

      if (item) {
        item.quantity = quantity
      }
    }
  }
})

export const { addToCart,removeFromCart,updateQuantity} = cartSlice.actions

export default cartSlice.reducer
