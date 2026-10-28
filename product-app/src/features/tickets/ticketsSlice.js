
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

  return { message, errors }
}

const getErrorPayload = (data, fallback, status = null) => ({
  status,
  ...normalizeApiError(data, fallback, status),
})

const getConnectionError = (message) =>
  getErrorPayload(null, message)

export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token
      const params = new URLSearchParams()

      if (filters?.status) {
        params.set('status', filters.status)
      }

      if (filters?.priority) {
        params.set('priority', filters.priority)
      }

      const query = params.toString()
      const path = query ? `/tickets?${query}` : '/tickets'

      const response = await apiRequest(path, { token })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        return rejectWithValue(
          getErrorPayload(
            data,
            'Unable to load tickets. Please try again.',
            response.status
          )
        )
      }

      return data
    } catch {
      return rejectWithValue(
        getConnectionError(
          'Unable to connect to the server. Please check your connection and try again.'
        )
      )
    }
  }
)

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token

      const response = await apiRequest('/tickets', {
        token,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        return rejectWithValue(
          getErrorPayload(
            data,
            'Unable to create ticket. Please try again.',
            response.status
          )
        )
      }

      return data
    } catch {
      return rejectWithValue(
        getConnectionError(
          'Unable to connect to the server. Please try again.'
        )
      )
    }
  }
)

export const updateTicket = createAsyncThunk(
  'tickets/updateTicket',
  async ({ id, ticketData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token

      const response = await apiRequest(`/tickets/${id}`, {
        token,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        return rejectWithValue(
          getErrorPayload(
            data,
            'Unable to update ticket. Please try again.',
            response.status
          )
        )
      }

      return data
    } catch {
      return rejectWithValue(
        getConnectionError(
          'Unable to connect to the server. Please try again.'
        )
      )
    }
  }
)

export const deleteTicket = createAsyncThunk(
  'tickets/deleteTicket',
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token

      const response = await apiRequest(`/tickets/${id}`, {
        token,
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)

        return rejectWithValue(
          getErrorPayload(
            data,
            'Unable to delete ticket. Please try again.',
            response.status
          )
        )
      }

      return id
    } catch {
      return rejectWithValue(
        getConnectionError(
          'Unable to connect to the server. Please try again.'
        )
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
  createFieldErrors: {},

  updateStatus: 'idle',
  updateError: null,
  updateFieldErrors: {},
  updateErrorStatus: null,

  deleteStatus: 'idle',
  deleteError: null,
  deleteErrorStatus: null,
}

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    clearTickets(state) {
      state.items = []
      state.status = 'idle'
      state.error = null
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          action.payload?.message ??
          action.error.message ??
          'Unable to load tickets.'
      })

      .addCase(createTicket.pending, (state) => {
        state.createStatus = 'loading'
        state.createError = null
        state.createFieldErrors = {}
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.createStatus = 'succeeded'
        state.createError = null
        state.createFieldErrors = {}

        const newTicket = action.payload
        const exists = state.items.some(
          (ticket) => Number(ticket.id) === Number(newTicket.id)
        )

        if (!exists) {
          state.items.unshift(newTicket)
        }
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.createStatus = 'failed'
        const payload = action.payload

        state.createFieldErrors = Object.fromEntries(
          (payload?.errors ?? []).map(({ field, message }) => [
            field,
            message,
          ])
        )

        state.createError =
          payload?.message ??
          action.error.message ??
          'Unable to create ticket.'
      })

      .addCase(updateTicket.pending, (state) => {
        state.updateStatus = 'loading'
        state.updateError = null
        state.updateErrorStatus = null
        state.updateFieldErrors = {}
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded'
        state.updateError = null
        state.updateErrorStatus = null
        state.updateFieldErrors = {}

        const updatedTicket = action.payload
        const index = state.items.findIndex(
          (ticket) =>
            Number(ticket.id) === Number(updatedTicket.id)
        )

        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...updatedTicket,
          }
        }
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.updateStatus = 'failed'
        const payload = action.payload

        state.updateErrorStatus = payload?.status ?? null

        state.updateFieldErrors = Object.fromEntries(
          (payload?.errors ?? []).map(({ field, message }) => [
            field,
            message,
          ])
        )

        state.updateError =
          payload?.message ??
          action.error.message ??
          'Unable to update ticket.'
      })

      .addCase(deleteTicket.pending, (state) => {
        state.deleteStatus = 'loading'
        state.deleteError = null
        state.deleteErrorStatus = null
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded'
        state.deleteError = null
        state.deleteErrorStatus = null

        state.items = state.items.filter(
          (ticket) =>
            Number(ticket.id) !== Number(action.payload)
        )
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.deleteStatus = 'failed'
        state.deleteErrorStatus = action.payload?.status ?? null

        state.deleteError =
          action.payload?.message ??
          action.error.message ??
          'Unable to delete ticket.'
      })
  },
})

export const { clearTickets } = ticketsSlice.actions

export default ticketsSlice.reducer

