
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createProduct } from '../features/products/productsSlice'
import { validateProductForm } from '../utils/productValidation'



function CreateProductForm() {
  const dispatch = useDispatch()

  const createStatus = useSelector(
    (state) => state.products.createStatus
  )

  const createError = useSelector(
    (state) => state.products.createError
  )

  const createFieldErrors = useSelector(
    (state) => state.products.createFieldErrors
  )

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    inStock: true
  })

  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === 'checkbox' ? checked : value
    }))

    setErrors((previousErrors) => {
      const { general, ...fieldErrors } = previousErrors

      return {
        ...fieldErrors,
        [name]: ''
      }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const cleanedFormData = {
      ...formData,
      name: formData.name.trim(),
      category: formData.category.trim()
    }

    const validationErrors = validateProductForm(cleanedFormData)

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    try {
      await dispatch(createProduct(cleanedFormData)).unwrap()

      setFormData({
        name: '',
        price: '',
        category: '',
        inStock: true
      })

      setErrors({})
    } catch {
    }
  }

  return (
    <div>
      <h2>Create Product</h2>

      {createStatus === 'succeeded' && (
        <p role="status">Product created successfully.</p>
      )}

      {(errors.general || createError) && (
        <p role="alert">
          {errors.general || createError}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="product-name">Product Name</label>

          <input
            id="product-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={Boolean(
              errors.name || createFieldErrors.name
            )}
            aria-describedby={
              errors.name || createFieldErrors.name
                ? 'product-name-error'
                : undefined
            }
          />

          {(errors.name || createFieldErrors.name) && (
            <p id="product-name-error" role="alert">
              {errors.name || createFieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="product-price">Price</label>

          <input
            id="product-price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            aria-invalid={Boolean(
              errors.price || createFieldErrors.price
            )}
            aria-describedby={
              errors.price || createFieldErrors.price
                ? 'product-price-error'
                : undefined
            }
          />

          {(errors.price || createFieldErrors.price) && (
            <p id="product-price-error" role="alert">
              {errors.price || createFieldErrors.price}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="product-category">Category</label>

          <select
            id="product-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            aria-invalid={Boolean(
              errors.category || createFieldErrors.category
            )}
            aria-describedby={
              errors.category || createFieldErrors.category
                ? 'product-category-error'
                : undefined
            }
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Stationery">Stationery</option>
            <option value="Testing">Testing</option>
            <option value="Test">Test</option>
          </select>

          {(errors.category || createFieldErrors.category) && (
            <p id="product-category-error" role="alert">
              {errors.category || createFieldErrors.category}
            </p>
          )}
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
            />
            In Stock
          </label>
        </div>

        <button
          type="submit"
          disabled={createStatus === 'loading'}
        >
          {createStatus === 'loading'
            ? 'Saving...'
            : 'Create Product'}
        </button>
      </form>
    </div>
  )
}

export default CreateProductForm
