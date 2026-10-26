
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createTask } from '../features/tasks/tasksSlice'
import { validateTaskForm } from '../utils/taskValidation'

function CreateTaskForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    createStatus,
    createError,
    createFieldErrors
  } = useSelector((state) => state.tasks)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    created_by: '',
    assigned_to: ''
  })

  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }))

    setErrors((previousErrors) => {
      const remainingErrors = { ...previousErrors }
      delete remainingErrors.general

      return {
        ...remainingErrors,
        [name]: ''
      }
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (createStatus === 'loading') {
      return
    }

    const cleanedFormData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim()
    }

    const validationErrors = validateTaskForm(cleanedFormData)

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    const payload = {
      ...cleanedFormData,
      created_by: Number(cleanedFormData.created_by),
      assigned_to:
        cleanedFormData.assigned_to === ''
          ? null
          : Number(cleanedFormData.assigned_to)
    }

    const result = await dispatch(createTask(payload))

    if (createTask.fulfilled.match(result)) {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        created_by: '',
        assigned_to: ''
      })

      setErrors({})
      navigate('/tasks')
    }
  }

  return (
    <div>
      <h2>Create Task</h2>

      {createError && (
        <p role="alert">{createError}</p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="task-title">Title</label>
          <input
            id="task-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            aria-invalid={Boolean(
              errors.title || createFieldErrors.title
            )}
            aria-describedby={
              errors.title || createFieldErrors.title
                ? 'task-title-error'
                : undefined
            }
          />
          {(errors.title || createFieldErrors.title) && (
            <p id="task-title-error" role="alert">
              {errors.title || createFieldErrors.title}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            aria-invalid={Boolean(
              errors.description || createFieldErrors.description
            )}
            aria-describedby={
              errors.description || createFieldErrors.description
                ? 'task-description-error'
                : undefined
            }
          />
          {(errors.description || createFieldErrors.description) && (
            <p id="task-description-error" role="alert">
              {errors.description || createFieldErrors.description}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="task-status">Status</label>
          <select
            id="task-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            aria-invalid={Boolean(
              errors.status || createFieldErrors.status
            )}
            aria-describedby={
              errors.status || createFieldErrors.status
                ? 'task-status-error'
                : undefined
            }
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {(errors.status || createFieldErrors.status) && (
            <p id="task-status-error" role="alert">
              {errors.status || createFieldErrors.status}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            aria-invalid={Boolean(
              errors.priority || createFieldErrors.priority
            )}
            aria-describedby={
              errors.priority || createFieldErrors.priority
                ? 'task-priority-error'
                : undefined
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {(errors.priority || createFieldErrors.priority) && (
            <p id="task-priority-error" role="alert">
              {errors.priority || createFieldErrors.priority}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="task-created-by">Created By (User ID)</label>
          <input
            id="task-created-by"
            type="number"
            name="created_by"
            min="1"
            step="1"
            value={formData.created_by}
            onChange={handleChange}
            aria-invalid={Boolean(
              errors.created_by || createFieldErrors.created_by
            )}
            aria-describedby={
              errors.created_by || createFieldErrors.created_by
                ? 'task-created-by-error'
                : undefined
            }
          />
          {(errors.created_by || createFieldErrors.created_by) && (
            <p id="task-created-by-error" role="alert">
              {errors.created_by || createFieldErrors.created_by}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="task-assigned-to">
            Assigned To (User ID)
          </label>
          <input
            id="task-assigned-to"
            type="number"
            name="assigned_to"
            min="1"
            step="1"
            value={formData.assigned_to}
            onChange={handleChange}
            aria-invalid={Boolean(
              errors.assigned_to || createFieldErrors.assigned_to
            )}
            aria-describedby={
              errors.assigned_to || createFieldErrors.assigned_to
                ? 'task-assigned-to-error'
                : undefined
            }
          />
          {(errors.assigned_to || createFieldErrors.assigned_to) && (
            <p id="task-assigned-to-error" role="alert">
              {errors.assigned_to || createFieldErrors.assigned_to}
            </p>
          )}
          <p>Leave empty if the task is unassigned.</p>
        </div>

        <button
          type="submit"
          disabled={createStatus === 'loading'}
        >
          {createStatus === 'loading' ? 'Saving...' : 'Create Task'}
        </button>
      </form>
    </div>
  )
}

export default CreateTaskForm
