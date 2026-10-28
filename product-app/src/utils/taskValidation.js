
export function validateTaskForm(formData, mode = 'create') {
  const errors = {}

  const title = formData.title.trim()


  if (!title) {
    errors.title = 'Title is required'
  } else if (title.length < 2 || title.length > 150) {
    errors.title = 'Title must be between 2 and 150 characters'
  }

  if (mode === 'create') {
    if (
      !Number.isInteger(Number(formData.created_by)) ||
      Number(formData.created_by) < 1 ||
      String(formData.created_by).trim() === ''
    ) {
      errors.created_by = 'Created By must be a valid user ID'
    }
  }


  if (
    formData.assigned_to !== '' &&
    formData.assigned_to !== null &&
    (
      !Number.isInteger(Number(formData.assigned_to)) ||
      Number(formData.assigned_to) < 1
    )
  ) {
    errors.assigned_to =
      'Assigned To must be a valid user ID or left empty'
  }

  if (
    !['pending', 'in_progress', 'completed'].includes(formData.status)
  ) {
    errors.status = 'Please select a valid status'
  }

  if (!['low', 'medium', 'high'].includes(formData.priority)) {
    errors.priority = 'Please select a valid priority'
  }
if (mode === 'create' || mode === 'edit') {
  if (
    !Number.isInteger(Number(formData.created_by)) ||
    Number(formData.created_by) < 1 ||
    String(formData.created_by).trim() === ''
  ) {
    errors.created_by = 'Created By must be a valid user ID'
  }
}
  return errors
}
