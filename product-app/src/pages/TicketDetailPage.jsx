
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTickets,
  updateTicket,
  deleteTicket,
} from '../features/tickets/ticketsSlice'

const VALID_STATUSES = [
  'open',
  'in_progress',
  'resolved',
  'closed',
]

const formatLabel = (value) => {
  if (!value) return '—'

  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function TicketDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((state) => state.auth.user)

  const {
    items,
    status,
    error,
    updateStatus,
    updateError,
    deleteStatus,
    deleteError,
    updateErrorStatus,
    updateFieldErrors,
  } = useSelector((state) => state.tickets)

  const isValidId = /^\d+$/.test(id) && Number(id) > 0

  const ticket = items.find(
    (item) => Number(item.id) === Number(id)
  )

  const isAdmin = user?.role === 'admin'
  const isAssignedUser =
    Number(ticket?.assigned_to) === Number(user?.id)
  const canUpdateStatus = isAdmin || isAssignedUser

  const handleDeleteTicket = async () => {
    if (!isAdmin) return

    const confirmed = window.confirm(
      'Are you sure you want to delete this ticket?'
    )

    if (!confirmed) return

    try {
      await dispatch(deleteTicket(ticket.id)).unwrap()
      navigate('/tickets', { replace: true })
    } catch {
      // Redux stores the deletion error for display below.
    }
  }

  const [selectedStatus, setSelectedStatus] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')

  const currentSelectedStatus =
    selectedStatus ?? ticket?.status ?? ''

  useEffect(() => {
    if (isValidId && status === 'idle') {
      dispatch(fetchTickets())
    }
  }, [dispatch, isValidId, status])

  const handleStatusUpdate = async (event) => {
    event.preventDefault()
    setStatusMessage('')

    if (!VALID_STATUSES.includes(currentSelectedStatus)) {
      setStatusMessage('Please select a valid status.')
      return
    }

    if (currentSelectedStatus === ticket.status) {
      setStatusMessage('Select a different status to update.')
      return
    }

    try {
      await dispatch(
        updateTicket({
          id: ticket.id,
          ticketData: { status: currentSelectedStatus },
        })
      ).unwrap()

      setSelectedStatus(null)
      setStatusMessage('Ticket status updated successfully.')
    } catch {
      // Redux stores the API error for display below.
    }
  }

  if (!isValidId) {
    return (
      <main>
        <h1>Invalid Ticket ID</h1>
        <p>Please provide a valid positive numeric ticket ID.</p>
        <Link to="/tickets">Back to Tickets</Link>
      </main>
    )
  }

  if (status === 'idle' || status === 'loading') {
    return <p role="status">Loading ticket details...</p>
  }

  if (status === 'failed' && !ticket) {
    return (
      <main>
        <h1>Unable to Load Ticket</h1>
        <p role="alert">{error || 'Unable to load tickets.'}</p>

        <button
          type="button"
          onClick={() => dispatch(fetchTickets())}
        >
          Try again
        </button>

        {' '}
        <Link to="/tickets">Back to Tickets</Link>
      </main>
    )
  }

  if (!ticket) {
    return (
      <main>
        <h1>Ticket Not Found</h1>
        <p>No ticket exists with ID {id}.</p>
        <Link to="/tickets">Back to Tickets</Link>
      </main>
    )
  }

  return (
    <main>
      <h1>Ticket Details</h1>

      <dl>
        <dt>Title</dt>
        <dd>{ticket.title || 'Untitled'}</dd>

        <dt>Description</dt>
        <dd>{ticket.description || 'No description provided.'}</dd>

        <dt>Status</dt>
        <dd>{formatLabel(ticket.status)}</dd>

        <dt>Priority</dt>
        <dd>{formatLabel(ticket.priority)}</dd>

        <dt>Creator</dt>
        <dd>
          {ticket.Creator?.name ||
            ticket.Creator?.email ||
            'Unknown'}
        </dd>

        <dt>Assignee</dt>
        <dd>
          {ticket.Assignee?.name ||
            ticket.Assignee?.email ||
            'Unassigned'}
        </dd>
      </dl>

      {canUpdateStatus && (
      <section>
        <h2>Update Status</h2>

        <form onSubmit={handleStatusUpdate}>
          <label htmlFor="ticket-status">New status</label>

          <select
            id="ticket-status"
            value={currentSelectedStatus}
            onChange={(event) => {
              setSelectedStatus(event.target.value)
              setStatusMessage('')
            }}
            disabled={updateStatus === 'loading'}
          >
            {VALID_STATUSES.map((ticketStatus) => (
              <option key={ticketStatus} value={ticketStatus}>
                {formatLabel(ticketStatus)}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={
              updateStatus === 'loading' ||
              currentSelectedStatus === ticket.status
            }
          >
            {updateStatus === 'loading'
              ? 'Updating...'
              : 'Update Status'}
          </button>
        </form>

        {statusMessage && (
          <p role="status">{statusMessage}</p>
        )}

        {updateErrorStatus === 403 ? (
          <p role="alert">
            You do not have permission to perform this action.
          </p>
        ) : (
          <>
            {updateError && (
              <p role="alert">{updateError}</p>
            )}

            {updateFieldErrors?.status && (
              <p role="alert">{updateFieldErrors.status}</p>
            )}
          </>
        )}
      </section>

      )}

      {isAdmin && (
        <section>
          <h2>Delete Ticket</h2>

          <button
            type="button"
            onClick={handleDeleteTicket}
            disabled={deleteStatus === 'loading'}
          >
            {deleteStatus === 'loading' ? 'Deleting...' : 'Delete Ticket'}
          </button>

          {deleteError && (
            <p role="alert">{deleteError}</p>
          )}
        </section>
      )}

      <Link to="/tickets">Back to Tickets</Link>
    </main>
  )
}

export default TicketDetailPage
