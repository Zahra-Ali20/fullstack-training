
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { validateProductForm } from '../utils/productValidation'
import { useNavigate } from 'react-router-dom'
import {
  createProduct,
  updateProduct
} from '../features/products/productsSlice'

function CreateProductForm({ product = null }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const createStatus = useSelector(
    (state) => state.products.createStatus
  )

  const createError = useSelector(
    (state) => state.products.createError
  )

  const createFieldErrors = useSelector(
    (state) => state.products.createFieldErrors
  )

  const updateStatus = useSelector(
    (state) => state.products.updateStatus
  )

  const updateError = useSelector(
    (state) => state.products.updateError
  )

  const updateFieldErrors = useSelector(
    (state) => state.products.updateFieldErrors
  )

  const [formData, setFormData] = useState(() => ({
    name: product?.name ?? '',
    price: product?.price ?? '',
    category: product?.category ?? '',
    inStock: Number(product?.inStock) === 1
  }))

  const [errors, setErrors] = useState({})

  const fieldErrors = product
    ? updateFieldErrors
    : createFieldErrors

  const status = product ? updateStatus : createStatus
  const apiError = product ? updateError : createError

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === 'checkbox' ? checked : value
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
      if (product) {
        await dispatch(
          updateProduct({
            id: product.id,
            productData: cleanedFormData
          })
        ).unwrap()
      } else {
        await dispatch(
          createProduct(cleanedFormData)
        ).unwrap()
      }

      setErrors({})
      navigate('/')
    } catch {
      // Redux stores backend errors for the form to display.
    }
  }

  return (
    <div>
      <h2>{product ? 'Edit Product' : 'Create Product'}</h2>

      {!product && createStatus === 'succeeded' && (
        <p role="status">Product created successfully.</p>
      )}

      {(errors.general || apiError) && (
        <p role="alert">
          {errors.general ||
            (typeof apiError === 'string'
              ? apiError
              : apiError?.message ||
                apiError?.error ||
                `Unable to ${product ? 'update' : 'create'} product. Please try again.`)}
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
              errors.name || fieldErrors.name
            )}
            aria-describedby={
              errors.name || fieldErrors.name
                ? 'product-name-error'
                : undefined
            }
          />

          {(errors.name || fieldErrors.name) && (
            <p id="product-name-error" role="alert">
              {errors.name || fieldErrors.name}
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
              errors.price || fieldErrors.price
            )}
            aria-describedby={
              errors.price || fieldErrors.price
                ? 'product-price-error'
                : undefined
            }
          />

          {(errors.price || fieldErrors.price) && (
            <p id="product-price-error" role="alert">
              {errors.price || fieldErrors.price}
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
              errors.category || fieldErrors.category
            )}
            aria-describedby={
              errors.category || fieldErrors.category
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

          {(errors.category || fieldErrors.category) && (
            <p id="product-category-error" role="alert">
              {errors.category || fieldErrors.category}
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
          disabled={status === 'loading'}
        >
          {status === 'loading'
            ? 'Saving...'
            : product
              ? 'Update Product'
              : 'Create Product'}
        </button>
      </form>
    </div>
  )
}

export default CreateProductForm
