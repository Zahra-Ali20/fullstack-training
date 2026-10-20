
import { configureStore } from '@reduxjs/toolkit'

import productsReducer from '../features/products/productsSlice'
import cartReducer from '../features/cart/cartSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer
  }
})


//The architectural change was made to establish Redux as the single source of truth for shared product API state, including products, loading status, and API errors.
// Previously, the useProducts custom hook managed this data. Keeping both useProducts and Redux's fetchProducts active could cause duplicate API requests and
// inconsistent state. Moving product data ownership to Redux centralizes state management and allows multiple components to access the same data consistently.
// The old useProducts.js file can remain for learning and reference, but it is no longer used in the active product flow.