
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProducts,
  deleteProduct
} from '../features/products/productsSlice'
import CreateProductForm from '../components/CreateProductForm'
import ProductDetails from '../components/ProductDetails'

function ProductDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [isEditing, setIsEditing] = useState(false)
  const dispatch = useDispatch()

  const products = useSelector((state) => state.products.items)
  const status = useSelector((state) => state.products.status)
  const error = useSelector((state) => state.products.error)
  const deleteStatus = useSelector((state) => state.products.deleteStatus)
  const deleteError = useSelector((state) => state.products.deleteError)
  const user = useSelector((state) => state.auth.user)

  const role = user?.role?.toLowerCase()
  const canEdit = role === 'manager' || role === 'admin'
  const canDelete = role === 'admin'

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts())
    }
  }, [dispatch, status])

  const product = products.find((item) => String(item.id) === id)

  const handleEdit = () => {
    if (canEdit) {
      setIsEditing(true)
    }
  }

  const handleDelete = async (productId) => {
    if (!canDelete || deleteStatus === 'loading') {
      return
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this product?'
    )

    if (!confirmed) {
      return
    }

    try {
      await dispatch(deleteProduct(productId)).unwrap()
      navigate('/')
    } catch {
      // The error is stored in Redux.
    }
  }

  return (
    <div>
      <Link to="/">Back to Products</Link>

      <h1>{isEditing ? 'Edit Product' : 'Product Details'}</h1>

      {status === 'loading' ? (
        <p>Loading product details...</p>
      ) : status === 'failed' ? (
        <>
          <p role="alert">{error}</p>
          <button onClick={() => dispatch(fetchProducts())}>
            Retry
          </button>
        </>
      ) : product ? (
        isEditing ? (
          <>
            <button onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <CreateProductForm product={product} />
          </>
        ) : (
          <ProductDetails
            product={product}
            onEdit={canEdit ? handleEdit : undefined}
            onDelete={canDelete ? handleDelete : undefined}
            isDeleting={deleteStatus === 'loading'}
          />
        )
      ) : (
        <p>Product not found.</p>
      )}

      {deleteStatus === 'loading' && (
        <p>Deleting product...</p>
      )}

      {deleteStatus === 'failed' && (
        <p role="alert">
          {String(deleteError ?? 'Unable to delete product.')}
        </p>
      )}
    </div>
  )
}

export default ProductDetailsPage
