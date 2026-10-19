
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchProducts = createAsyncThunk(
  'fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/products`
      )

      if (!response.ok) {
        throw new Error()
      }

      return await response.json()
    } catch {
      return rejectWithValue(
        'Unable to load products. Please check your connection and try again.'
      )
    }
  }
)

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/products`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...productData,
            price: Number(productData.price)
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data)
      }

      return data
    } catch {
      return rejectWithValue(
        'Unable to connect to the server. Please try again.'
      )
    }
  }
)

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  createStatus: 'idle',
  createError: null,
  createFieldErrors: {}
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          action.payload ?? action.error.message
      })

      .addCase(createProduct.pending, (state) => {
        state.createStatus = 'loading'
        state.createError = null
        state.createFieldErrors = {}
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.createStatus = 'succeeded'
        state.createError = null
        state.createFieldErrors = {}
        state.items.push(action.payload)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createStatus = 'failed'

        const payload = action.payload

        if (Array.isArray(payload?.errors)) {
          state.createFieldErrors = Object.fromEntries(
            payload.errors.map(({ field, message }) => [
              field,
              message
            ])
          )
        }

        if (typeof payload === 'string') {
          state.createError = payload
        } else {
          state.createError =
            payload?.message ??
            'Unable to create product. Please try again.'
        }
      })
  }
})

export default productsSlice.reducer
