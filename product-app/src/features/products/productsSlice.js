
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiRequest } from '../../utils/api'

const normalizeApiError = (data, fallback, status = null) => {
  const errors = Array.isArray(data?.errors)
    ? data.errors
    : []

  let message =
    data?.message ??
    data?.error ??
    (errors.length > 0 ? null : fallback)

  if (status === 403) {
    message = 'You do not have permission to perform this action.'
  }

  return {
    message,
    errors
  }
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token

      const response = await apiRequest('/products', { token })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        return rejectWithValue(
          response.status === 403
            ? 'You do not have permission to perform this action.'
            : data?.message ||
                data?.error ||
                'Unable to load products. Please try again.'
        )
      }

      return data
    } catch {
      return rejectWithValue(
        'Unable to connect to the server. Please check your connection and try again.'
      )
    }
  }
)

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token

      const response = await apiRequest('/products', {
        token,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productData,
          price: Number(productData.price)
        })
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        return rejectWithValue({
          status: response.status,
          ...normalizeApiError(
            data,
            'Unable to create product. Please try again.',
            response.status
          )
        })
      }

      return data
    } catch {
      return rejectWithValue({
        status: null,
        ...normalizeApiError(
          null,
          'Unable to connect to the server. Please try again.'
        )
      })
    }
  }
)

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token

      const response = await apiRequest(`/products/${id}`, {
        token,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productData,
          price: Number(productData.price)
        })
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        return rejectWithValue({
          status: response.status,
          ...normalizeApiError(
            data,
            'Unable to update product. Please try again.',
            response.status
          )
        })
      }

      return data
    } catch {
      return rejectWithValue({
        status: null,
        ...normalizeApiError(
          null,
          'Unable to connect to the server. Please try again.'
        )
      })
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token

      const response = await apiRequest(`/products/${id}`, {
        token,
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)

        return rejectWithValue({
          status: response.status,
          ...normalizeApiError(
            data,
            'Unable to delete product. Please try again.',
            response.status
          )
        })
      }

      return id
    } catch {
      return rejectWithValue({
        status: null,
        ...normalizeApiError(
          null,
          'Unable to connect to the server. Please try again.'
        )
      })
    }
  }
)

const initialState = {
  items: [],
  status: 'idle',
  error: null,

  createStatus: 'idle',
  createError: null,
  createFieldErrors: {},

  updateStatus: 'idle',
  updateError: null,
  updateFieldErrors: {},
  updateErrorStatus: null,

  deleteStatus: 'idle',
  deleteError: null,
  deleteErrorStatus: null
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // FETCH PRODUCTS
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
        state.error = action.payload ?? action.error.message
      })

      // CREATE PRODUCT
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

        state.createFieldErrors = Object.fromEntries(
          (payload?.errors ?? []).map(({ field, message }) => [
            field,
            message
          ])
        )

        state.createError =
          payload?.message ??
          (typeof payload === 'string'
            ? payload
            : action.error.message ??
              'Unable to create product. Please try again.')
      })

      // UPDATE PRODUCT
      .addCase(updateProduct.pending, (state) => {
        state.updateStatus = 'loading'
        state.updateError = null
        state.updateErrorStatus = null
        state.updateFieldErrors = {}
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded'
        state.updateError = null
        state.updateErrorStatus = null
        state.updateFieldErrors = {}

        const updatedProduct = action.payload

        const index = state.items.findIndex(
          (product) =>
            Number(product.id) === Number(updatedProduct.id)
        )

        if (index !== -1) {
          state.items[index] = updatedProduct
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updateStatus = 'failed'
        const payload = action.payload

        state.updateErrorStatus = payload?.status ?? null

        state.updateFieldErrors = Object.fromEntries(
          (payload?.errors ?? []).map(({ field, message }) => [
            field,
            message
          ])
        )

        state.updateError =
          payload?.message ??
          (typeof payload === 'string'
            ? payload
            : action.error.message ??
              'Unable to update product. Please try again.')
      })

      // DELETE PRODUCT
      .addCase(deleteProduct.pending, (state) => {
        state.deleteStatus = 'loading'
        state.deleteError = null
        state.deleteErrorStatus = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded'
        state.deleteError = null
        state.deleteErrorStatus = null

        state.items = state.items.filter(
          (product) =>
            Number(product.id) !== Number(action.payload)
        )
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleteStatus = 'failed'
        state.deleteErrorStatus = action.payload?.status ?? null

        state.deleteError =
          action.payload?.message ??
          (typeof action.payload === 'string'
            ? action.payload
            : action.error.message ??
              'Unable to delete product. Please try again.')
      })
  }
})

export default productsSlice.reducer
