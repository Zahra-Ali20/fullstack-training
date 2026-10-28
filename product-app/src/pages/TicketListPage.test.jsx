
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TicketListPage from './TicketListPage'
import TicketDetailPage from './TicketDetailPage'
import { renderWithProviders } from '../test/test-utils'

vi.mock('../features/tickets/ticketsSlice', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    fetchTickets: () => ({ type: 'tickets/fetchTickets' }),
  }
})

describe('Ticket List Filtering', () => {
  it('shows only open tickets when the Open filter is selected', async () => {
    const user = userEvent.setup()

    const tickets = [
      {
        id: 1,
        title: 'Ticket A',
        status: 'open',
        priority: 'medium',
        Creator: { name: 'Creator A' },
        Assignee: null,
      },
      {
        id: 2,
        title: 'Ticket B',
        status: 'resolved',
        priority: 'high',
        Creator: { name: 'Creator B' },
        Assignee: null,
      },
      {
        id: 3,
        title: 'Ticket C',
        status: 'open',
        priority: 'low',
        Creator: { name: 'Creator C' },
        Assignee: null,
      },
    ]

    renderWithProviders(<TicketListPage />, {
      withRouter: true,
      preloadedState: {
        auth: {
          user: { id: 7, role: 'user' },
        },
        tickets: {
          items: tickets,
          status: 'succeeded',
          error: null,
          updateStatus: 'idle',
          updateError: null,
          deleteStatus: 'idle',
          deleteError: null,
          updateErrorStatus: null,
          updateFieldErrors: {},
        },
      },
    })

    await user.selectOptions(
      screen.getByRole('combobox', {
        name: /filter by status/i,
      }),
      'open'
    )

    expect(
      screen.getByRole('button', { name: 'Ticket A' })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Ticket C' })
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: 'Ticket B' })
    ).not.toBeInTheDocument()
  })
})

describe('Role-Based Status Control', () => {
  const ticket = {
    id: 101,
    title: 'Test Ticket',
    description: 'Ticket for role-based status testing',
    status: 'open',
    priority: 'medium',
    created_by: 1,
    assigned_to: 7,
    Creator: { id: 1, name: 'Creator' },
    Assignee: { id: 7, name: 'Assigned User' },
  }

  const ticketsState = {
    items: [ticket],
    status: 'succeeded',
    error: null,
    updateStatus: 'idle',
    updateError: null,
    deleteStatus: 'idle',
    deleteError: null,
    updateErrorStatus: null,
    updateFieldErrors: {},
  }

  it('allows the assigned user to update ticket status', () => {
    renderWithProviders(<TicketDetailPage />, {
      withRouter: true,
      route: '/tickets/101',
      path: '/tickets/:id',
      preloadedState: {
        auth: {
          user: { id: 7, role: 'user' },
          token: 'test-token',
          status: 'succeeded',
          error: null,
        },
        tickets: ticketsState,
      },
    })

    expect(
      screen.getByRole('heading', { name: 'Update Status' })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('combobox', { name: 'New status' })
    ).toBeInTheDocument()
  })

  it('does not allow an unassigned user to update ticket status', () => {
    renderWithProviders(<TicketDetailPage />, {
      withRouter: true,
      route: '/tickets/101',
      path: '/tickets/:id',
      preloadedState: {
        auth: {
          user: { id: 9, role: 'user' },
          token: 'test-token',
          status: 'succeeded',
          error: null,
        },
        tickets: ticketsState,
      },
    })

    expect(
      screen.queryByRole('heading', { name: 'Update Status' })
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('combobox', { name: 'New status' })
    ).not.toBeInTheDocument()
  })
})
