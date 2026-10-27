
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTasks,
  updateTask,
  deleteTask
} from '../features/tasks/tasksSlice'
import { validateTaskForm } from '../utils/taskValidation'

function TaskDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isValidId = /^\d+$/.test(id)

  const {
    items: tasks,
    status,
    error,
    updateStatus,
    updateError,
    updateFieldErrors,
    deleteStatus,
    deleteError
  } = useSelector((state) => state.tasks)

  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    created_by: '',
    status: 'pending',
    priority: 'medium',
    assigned_to: ''
  })

  const [localErrors, setLocalErrors] = useState({})

  useEffect(() => {
    if (isValidId && status === 'idle') {
      dispatch(fetchTasks())
    }
  }, [dispatch, isValidId, status])

  const task = tasks.find(
    (task) => String(task.id) === id
  )

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    )

    if (!confirmed) {
      return
    }

    const result = await dispatch(deleteTask(task.id))

    if (deleteTask.fulfilled.match(result)) {
      navigate('/tasks')
    }
  }

  const startEditing = () => {
    setFormData({
      title: task.title ?? '',
      description: task.description ?? '',
      created_by:
        task.created_by == null
          ? ''
          : String(task.created_by),
      status: task.status ?? 'pending',
      priority: task.priority ?? 'medium',
      assigned_to:
        task.assigned_to == null
          ? ''
          : String(task.assigned_to)
    })

    setLocalErrors({})
    setIsEditing(true)
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const errors = validateTaskForm(formData, 'edit')
    setLocalErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    const result = await dispatch(
      updateTask({
        id: task.id,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assigned_to:
          formData.assigned_to === ''
            ? null
            : Number(formData.assigned_to)
      })
    )

    if (updateTask.fulfilled.match(result)) {
  await dispatch(fetchTasks());
  setIsEditing(false);
}
  }

  if (!isValidId) {
    return <p>Invalid task ID.</p>
  }

  if (status === 'idle' || status === 'loading') {
    return <p>Loading task details...</p>
  }

  if (status === 'failed') {
    return (
      <div>
        <p>{error || 'Unable to load task details.'}</p>
        <button onClick={() => dispatch(fetchTasks())}>
          Retry
        </button>
      </div>
    )
  }

  if (!task) {
    return <p>Task not found.</p>
  }

  if (isEditing) {
    return (
      <main>
        <h1>Edit Task</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />

            {(localErrors.title || updateFieldErrors.title) && (
              <p role="alert">
                {localErrors.title || updateFieldErrors.title}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="created_by">
              Created By (User ID)
            </label>
            <input
              id="created_by"
              name="created_by"
              type="number"
              min="1"
              value={formData.created_by}
              onChange={handleChange}
            />

            {(localErrors.created_by ||
              updateFieldErrors.created_by) && (
              <p role="alert">
                {localErrors.created_by ||
                  updateFieldErrors.created_by}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {(localErrors.status || updateFieldErrors.status) && (
              <p role="alert">
                {localErrors.status || updateFieldErrors.status}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            {(localErrors.priority ||
              updateFieldErrors.priority) && (
              <p role="alert">
                {localErrors.priority ||
                  updateFieldErrors.priority}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="assigned_to">
              Assigned To (User ID, optional)
            </label>
            <input
              id="assigned_to"
              name="assigned_to"
              type="number"
              min="1"
              value={formData.assigned_to}
              onChange={handleChange}
            />

            {(localErrors.assigned_to ||
              updateFieldErrors.assigned_to) && (
              <p role="alert">
                {localErrors.assigned_to ||
                  updateFieldErrors.assigned_to}
              </p>
            )}
          </div>

          {updateError && (
            <p role="alert">{updateError}</p>
          )}

          <button
            type="submit"
            disabled={updateStatus === 'loading'}
          >
            {updateStatus === 'loading'
              ? 'Saving...'
              : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsEditing(false)
              setLocalErrors({})
            }}
          >
            Cancel
          </button>
        </form>
      </main>
    )
  }

  return (
    <main>
      <h1>{task.title}</h1>

      <p>
        <strong>Description:</strong>{' '}
        {task.description || 'No description available'}
      </p>

      <p>
        <strong>Status:</strong> {task.status}
      </p>

      <p>
        <strong>Priority:</strong> {task.priority}
      </p>

      <p>
        <strong>Created By:</strong>{' '}
        {task.created_by_name ??
          (task.created_by != null
            ? `User ID: ${task.created_by}`
            : 'Unknown')}
      </p>

      <p>
        <strong>Assigned To:</strong>{' '}
        {task.assigned_to_name ??
          (task.assigned_to != null
            ? `User ID: ${task.assigned_to}`
            : 'Unassigned')}
      </p>

      <p>
        <strong>Created At:</strong>{' '}
        {task.created_at
          ? new Date(task.created_at).toLocaleString()
          : 'Unknown'}
      </p>

      <button
        type="button"
        onClick={startEditing}
      >
        Edit Task
      </button>

      {deleteError && (
        <p role="alert">{deleteError}</p>
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleteStatus === 'loading'}
      >
        {deleteStatus === 'loading'
          ? 'Deleting...'
          : 'Delete Task'}
      </button>
    </main>
  )
}

export default TaskDetailPage
