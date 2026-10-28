import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createTicket } from '../features/tickets/ticketsSlice'
import { validateTicketForm } from '../utils/ticketValidation'

function CreateTicketForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const submissionInProgress = useRef(false)

  const { createStatus, createError } = useSelector(
    (state) => state.tickets
  )

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    assigned_to: '',
  })

  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const isSubmitting = createStatus === 'loading'

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setFieldErrors((previous) => ({
      ...previous,
      [name]: '',
    }))

    setSubmitError('')
    setSaveSuccess(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Prevent duplicate requests, including rapid double-clicks.
    if (submissionInProgress.current) return

    setSubmitError('')
    setSaveSuccess(false)

    const errors = validateTicketForm(formData)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) return

    const ticketData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      assigned_to: formData.assigned_to.trim()
        ? Number(formData.assigned_to)
        : null,
    }

    submissionInProgress.current = true

    try {
      const createdTicket = await dispatch(
        createTicket(ticketData)
      ).unwrap()

      // createTicket.fulfilled updates Redux before unwrap resolves.
      setSaveSuccess(true)
      navigate(`/tickets/${createdTicket.id}`)
    } catch (error) {
      if (Array.isArray(error?.errors) && error.errors.length > 0) {
        const backendFieldErrors = Object.fromEntries(
          error.errors
            .filter(
              (item) =>
                item &&
                typeof item.field === 'string' &&
                typeof item.message === 'string'
            )
            .map((item) => [item.field, item.message])
        )

        setFieldErrors((previous) => ({
          ...previous,
          ...backendFieldErrors,
        }))

        if (error.message) {
          setSubmitError(error.message)
        } else if (Object.keys(backendFieldErrors).length === 0) {
          setSubmitError(
            'The server rejected the ticket. Please check your input.'
          )
        }
      } else if (error?.fieldErrors) {
        setFieldErrors((previous) => ({
          ...previous,
          ...error.fieldErrors,
        }))
      } else {
        setSubmitError(
          typeof error === 'string'
            ? error
            : error?.message ||
                createError ||
                'Unable to create ticket.'
        )
      }

      // Do not reset formData on failure; preserve entered values.
    } finally {
      submissionInProgress.current = false
    }
  }

  return (
    <main>
      <h1>Create Ticket</h1>

      {saveSuccess && (
        <p role="status">Redux updated</p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            maxLength={150}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.title)}
          />
          {fieldErrors.title && (
            <p role="alert">{fieldErrors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.description)}
          />
          {fieldErrors.description && (
            <p role="alert">{fieldErrors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.status)}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          {fieldErrors.status && (
            <p role="alert">{fieldErrors.status}</p>
          )}
        </div>

        <div>
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.priority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {fieldErrors.priority && (
            <p role="alert">{fieldErrors.priority}</p>
          )}
        </div>

        <div>
          <label htmlFor="assigned_to">Assigned To (User ID)</label>
          <input
            id="assigned_to"
            name="assigned_to"
            type="number"
            min="1"
            step="1"
            value={formData.assigned_to}
            onChange={handleChange}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.assigned_to)}
          />
          <p>Leave empty if the ticket is unassigned.</p>
          {fieldErrors.assigned_to && (
            <p role="alert">{fieldErrors.assigned_to}</p>
          )}
        </div>

        {(submitError || createError) && (
          <p role="alert">
            {submitError || createError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Create Ticket'}
        </button>

        {' '}
        <Link to="/tickets">Cancel</Link>
      </form>
    </main>
  )
}

export default CreateTicketForm