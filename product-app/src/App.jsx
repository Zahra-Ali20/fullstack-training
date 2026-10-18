import { useState,useMemo,useCallback,useRef,useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from './features/products/productsSlice'
import ProductList from './components/ProductList'
import ProductDetails from './components/ProductDetails'
import ProductStats from './components/ProductStats'
import Cart from './components/Cart'
import CartSummary from './components/CartSummary'
function App() {

  const dispatch = useDispatch()
  const products = useSelector((state) => state.products.items)
  const status = useSelector((state) => state.products.status)
  const error = useSelector((state) => state.products.error)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [sortOrder, setSortOrder] = useState("default")
  const searchInputRef = useRef(null)
 const handleProductClick = useCallback((product) => {
  setSelectedProduct(product)
}, [])
useEffect(() => {
  dispatch(fetchProducts())
}, [dispatch])
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("All")
    setShowInStockOnly(false)
    setSortOrder("default")
    setSelectedProduct(null)
  }
  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory
      const matchesStock =
     !showInStockOnly || Number(product.inStock) === 1

      return matchesSearch && matchesCategory && matchesStock
    })

    if (sortOrder === "lowToHigh") {
      result.sort((a, b) => Number(a.price) - Number(b.price))
    }

    if (sortOrder === "highToLow") {
      result.sort((a, b) => Number(b.price) - Number(a.price))
    }

    return result
  }, [
    products,
    searchTerm,
    selectedCategory,
    showInStockOnly,
    sortOrder
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
         <button onClick={() => dispatch(fetchProducts())}>Retry</button>
      </div>
    )
  }
  return (

    <div>
      <div style={{ position: 'absolute', top: '20px', right: '20px', width: '300px' }}>
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
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={() => searchInputRef.current.focus()}>
      Focus Search
      </button>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Electronics">Electronics</option>
        <option value="Furniture">Furniture</option>
        <option value="Stationery">Stationery</option>
        <option value="Testing">Testing</option>
        <option value="Test">Test</option>
      </select>
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="default">Default</option>
        <option value="lowToHigh">Price: Low to High</option>
        <option value="highToLow">Price: High to Low</option>
      </select>
      <label>
        <input
          type="checkbox"
          checked={showInStockOnly}
          onChange={(e) => setShowInStockOnly(e.target.checked)}
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
      <ProductDetails product={selectedProduct} />
    </div>
  )
}
export default App;
