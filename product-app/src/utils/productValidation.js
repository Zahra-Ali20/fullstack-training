export function validateProductForm(formData) {
  const newErrors = {}

  const trimmedName = formData.name.trim()

  if (!trimmedName) {
    newErrors.name = 'Name is required'
  } else if (trimmedName.length < 2) {
    newErrors.name = 'Name must be at least 2 characters'
  } else if (trimmedName.length > 100) {
    newErrors.name = 'Name cannot exceed 100 characters'
  }

  const priceInput = String(formData.price ?? '').trim()
  const numericPrice = Number(priceInput)

  if (priceInput === '') {
    newErrors.price = 'Price is required'
  } else if (
    !Number.isFinite(numericPrice) ||
    numericPrice <= 0
  ) {
    newErrors.price = 'Price must be a number greater than 0'
  }

  const trimmedCategory = formData.category.trim()

  if (!trimmedCategory) {
    newErrors.category = 'Category is required'
  } else if (trimmedCategory.length > 50) {
    newErrors.category = 'Category cannot exceed 50 characters'
  }

  return newErrors
}