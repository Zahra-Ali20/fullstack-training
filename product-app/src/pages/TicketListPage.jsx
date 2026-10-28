
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchTickets } from '../features/tickets/ticketsSlice'

const formatLabel = (value) => {
  if (!value) return '—'

  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function TicketListPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [selectedStatus, setSelectedStatus] = useState('all')

  const { items, status, error } = useSelector(
    (state) => state.tickets
  )

  const user = useSelector((state) => state.auth.user)
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    dispatch(fetchTickets())
  }, [dispatch])

  const filteredTickets = useMemo(() => {
    if (selectedStatus === 'all') {
      return items
    }

    return items.filter(
      (ticket) => ticket.status === selectedStatus
    )
  }, [items, selectedStatus])

  const handleRetry = () => {
    dispatch(fetchTickets())
  }

  const handleTicketClick = (ticketId) => {
    navigate(`/tickets/${ticketId}`)
  }

  return (
    <main>
      <h1>Tickets</h1>

      {isAdmin && (
        <button
          type="button"
          onClick={() => navigate('/tickets/new')}
        >
          Create Ticket
        </button>
      )}

      {status === 'loading' && items.length === 0 && (
        <p role="status">Loading tickets...</p>
      )}

      {status === 'failed' && items.length === 0 && (
        <section>
          <p role="alert">
            {error || 'Unable to load tickets.'}
          </p>

          <button type="button" onClick={handleRetry}>
            Try again
          </button>
        </section>
      )}

      {items.length > 0 && (
        <>
          <div>
            <label htmlFor="ticket-status-filter">
              Filter by status:{' '}
            </label>

            <select
              id="ticket-status-filter"
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(event.target.value)
              }
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {status === 'loading' && (
            <p role="status">Refreshing tickets...</p>
          )}

          {status === 'failed' && (
            <section>
              <p role="alert">
                {error || 'Unable to refresh tickets.'}
                {' '}Previously loaded tickets are still shown.
              </p>

              <button type="button" onClick={handleRetry}>
                Try again
              </button>
            </section>
          )}

          {filteredTickets.length === 0 ? (
            <p>No tickets found for this status.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Status</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Creator</th>
                    <th scope="col">Assignee</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            handleTicketClick(ticket.id)
                          }
                        >
                          {ticket.title || 'Untitled'}
                        </button>
                      </td>

                      <td>{formatLabel(ticket.status)}</td>
                      <td>{formatLabel(ticket.priority)}</td>

                      <td>
                        {ticket.Creator?.name ||
                          ticket.Creator?.email ||
                          'Unknown'}
                      </td>

                      <td>
                        {ticket.Assignee?.name ||
                          ticket.Assignee?.email ||
                          'Unassigned'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {status === 'succeeded' && items.length === 0 && (
        <p>No tickets found.</p>
      )}
    </main>
  )
}

export default TicketListPage
