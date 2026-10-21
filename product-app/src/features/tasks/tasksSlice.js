
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_URL = `${import.meta.env.VITE_TASKS_API_BASE_URL}/tasks`

const normalizeApiError = (data, fallback) => {
  const errors = Array.isArray(data?.errors)
    ? data.errors
    : []

  return {
    message:
      data?.message ??
      data?.error ??
      (errors.length > 0 ? null : fallback),
    errors
  }
}


export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        return rejectWithValue(
          data?.message ??
          data?.error ??
          'Unable to load tasks. Please check your connection and try again.'
        )
      }

      return data
    } catch {
      return rejectWithValue(
        'Unable to load tasks. Please check your connection and try again.'
      )
    }
  }
)


export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        return rejectWithValue({
          status: response.status,
          ...normalizeApiError(
            data,
            'Unable to create task. Please try again.'
          )
        })
      }

      const taskId = data.taskId

      const taskResponse = await fetch(`${API_URL}/${taskId}`)

      if (!taskResponse.ok) {
        return rejectWithValue({
          type: 'api',
          message:
            'Task was created, but its details could not be loaded.'
        })
      }

      return await taskResponse.json()
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

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, ...taskData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        return rejectWithValue({
          status: response.status,
          ...normalizeApiError(
            data,
            'Unable to update task. Please try again.'
          )
        })
      }

      if (
        data &&
        typeof data === 'object' &&
        data.id !== undefined &&
        data.title !== undefined
      ) {
        return data
      }

      const taskResponse = await fetch(`${API_URL}/${id}`)

      if (!taskResponse.ok) {
        return rejectWithValue({
          status: taskResponse.status,
          message:
            'Task was updated, but its details could not be loaded.',
          errors: []
        })
      }

      return await taskResponse.json()
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


export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      if (response.status === 204) {
        return id
      }

      if (!response.ok) {
        const data = await response.json().catch(() => null)

        return rejectWithValue({
          status: response.status,
          ...normalizeApiError(
            data,
            'Unable to delete task. Please try again.'
          )
        })
      }

      const data = await response.json().catch(() => null)

      if (data && data.success === false) {
        return rejectWithValue({
          status: response.status,
          ...normalizeApiError(
            data,
            'Unable to delete task.'
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

  deleteStatus: 'idle',
  deleteError: null
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })

      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })

      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          action.payload ?? action.error.message
      })

      .addCase(createTask.pending, (state) => {
        state.createStatus = 'loading'
        state.createError = null
        state.createFieldErrors = {}
      })

      .addCase(createTask.fulfilled, (state, action) => {
        state.createStatus = 'succeeded'
        state.createError = null
        state.createFieldErrors = {}

        state.items.push(action.payload)
      })

      .addCase(createTask.rejected, (state, action) => {
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
              'Unable to create task. Please try again.')
      })

      .addCase(updateTask.pending, (state) => {
        state.updateStatus = 'loading'
        state.updateError = null
        state.updateFieldErrors = {}
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded'
        state.updateError = null
        state.updateFieldErrors = {}

        const updatedTask = action.payload

        const index = state.items.findIndex(
          (task) => String(task.id) === String(updatedTask.id)
        )

        if (index !== -1) {
          state.items[index] = updatedTask
        }
      })

      .addCase(updateTask.rejected, (state, action) => {
        state.updateStatus = 'failed'

        const payload = action.payload

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
              'Unable to update task. Please try again.')
      })

      .addCase(deleteTask.pending, (state) => {
        state.deleteStatus = 'loading'
        state.deleteError = null
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded'
        state.deleteError = null

        state.items = state.items.filter(
          (task) => String(task.id) !== String(action.payload)
        )
      })

      .addCase(deleteTask.rejected, (state, action) => {
        state.deleteStatus = 'failed'

        const payload = action.payload

        state.deleteError =
          payload?.message ??
          (typeof payload === 'string'
            ? payload
            : action.error.message ??
              'Unable to delete task. Please try again.')
      })
  }
})

export default tasksSlice.reducer
