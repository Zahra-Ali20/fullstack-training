
const VALID_STATUSES = [
  'open',
  'in_progress',
  'resolved',
  'closed',
]

const VALID_PRIORITIES = [
  'low',
  'medium',
  'high',
]

export function validateTicketForm(formData) {
  const errors = {}

  const title = formData.title.trim()

  if (!title) {
    errors.title = 'Title is required.'
  } else if (title.length < 2 || title.length > 150) {
    errors.title = 'Title must be between 2 and 150 characters.'
  }

  if (!VALID_STATUSES.includes(formData.status)) {
    errors.status = 'Please select a valid status.'
  }

  if (!VALID_PRIORITIES.includes(formData.priority)) {
    errors.priority = 'Please select a valid priority.'
  }

  const assignedTo = formData.assigned_to.trim()

  if (assignedTo !== '') {
    const assignedToNumber = Number(assignedTo)

    if (
      !Number.isInteger(assignedToNumber) ||
      assignedToNumber <= 0
    ) {
      errors.assigned_to =
        'Assigned To must be a positive whole-number user ID, or left empty.'
    }
  }

  return errors
}

