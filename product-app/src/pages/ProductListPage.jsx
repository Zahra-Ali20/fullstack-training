
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchProducts } from '../features/products/productsSlice'
import ProductList from '../components/ProductList'
import ProductStats from '../components/ProductStats'
import Cart from '../components/Cart'
import CartSummary from '../components/CartSummary'

function ProductListPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const products = useSelector((state) => state.products.items)
  const status = useSelector((state) => state.products.status)
  const error = useSelector((state) => state.products.error)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [sortOrder, setSortOrder] = useState('default')

  const searchInputRef = useRef(null)

  const handleProductClick = useCallback((product) => {
    navigate(`/products/${product.id}`)
  }, [navigate])

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts())
    }
  }, [dispatch, status])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All')
    setShowInStockOnly(false)
    setSortOrder('default')
  }

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      const matchesCategory =
        selectedCategory === 'All' ||
        product.category === selectedCategory

      const matchesStock =
        !showInStockOnly || Number(product.inStock) === 1

      return matchesSearch && matchesCategory && matchesStock
    })

    if (sortOrder === 'lowToHigh') {
      result.sort((a, b) => Number(a.price) - Number(b.price))
    }

    if (sortOrder === 'highToLow') {
      result.sort((a, b) => Number(b.price) - Number(a.price))
    }

    return result
  }, [
    products,
    searchTerm,
    selectedCategory,
    showInStockOnly,
    sortOrder,
  ])

  if (status === 'loading') {
    return (
      <div>
        <h1>Product Manager</h1>
        <p>Loading products...</p>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div>
        <h1>Product Manager</h1>
        <p>Error: {error}</p>
        <button onClick={() => dispatch(fetchProducts())}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '300px',
        }}
      >
        <Cart />
        <CartSummary />
      </div>

      <h1>Product Manager</h1>

      <ProductStats products={products} />

      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search products"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      <button onClick={() => searchInputRef.current.focus()}>
        Focus Search
      </button>

      <select
        aria-label="Filter by category"
        value={selectedCategory}
        onChange={(event) => setSelectedCategory(event.target.value)}
      >
        <option value="All">All</option>
        <option value="Electronics">Electronics</option>
        <option value="Furniture">Furniture</option>
        <option value="Stationery">Stationery</option>
        <option value="Testing">Testing</option>
        <option value="Test">Test</option>
      </select>

      <select
        aria-label="Sort products"
        value={sortOrder}
        onChange={(event) => setSortOrder(event.target.value)}
      >
        <option value="default">Default</option>
        <option value="lowToHigh">Price: Low to High</option>
        <option value="highToLow">Price: High to Low</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={showInStockOnly}
          onChange={(event) => setShowInStockOnly(event.target.checked)}
        />
        Show in-stock products only
      </label>

      <button onClick={clearFilters}>Clear Filters</button>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ProductList
          products={filteredProducts}
          onSelectProduct={handleProductClick}
        />
      )}
    </div>
  )
}

export default ProductListPage
