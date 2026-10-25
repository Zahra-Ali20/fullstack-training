import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiRequest } from '../../utils/api'

const AUTH_STORAGE_KEY = 'auth'

const getStoredAuth = () => {
  try {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)

    if (!storedAuth) {
      return { user: null, token: null }
    }

    const auth = JSON.parse(storedAuth)

    if (!auth?.token || !auth?.user) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return { user: null, token: null }
    }

    return {
      user: auth.user,
      token: auth.token
    }
  } catch {
    return { user: null, token: null }
  }
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(credentials)
})

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        return rejectWithValue(
          data?.message || 'Login failed. Please try again.'
        )
      }

      if (!data?.token || !data?.user) {
        return rejectWithValue(
          'Login response is missing the token or user information.'
        )
      }

      const auth = {
        token: data.token,
        user: data.user
      }

      // Persist authentication for the training application.
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
      } catch {
        // Login can still succeed if browser storage is unavailable.
      }

      return auth
    } catch {
      return rejectWithValue(
        'Unable to connect to the server. Please try again.'
      )
    }
  }
)

// Logout side effects belong outside the reducer.
export const logout = () => (dispatch) => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    // Continue clearing the in-memory authentication state.
  }

  dispatch(authSlice.actions.loggedOut())
}

const authSlice = createSlice({
  name: 'auth',

  initialState: {
    ...getStoredAuth(),
    status: 'idle',
    error: null
  },

  reducers: {
    loggedOut: (state) => {
      state.user = null
      state.token = null
      state.status = 'idle'
      state.error = null
    },

    clearAuthError: (state) => {
      state.error = null
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.user = action.payload.user
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          action.payload || 'Login failed. Please try again.'
      })
  }
})

export const { clearAuthError } = authSlice.actions

export default authSlice.reducer