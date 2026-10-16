import { useState,useMemo,useCallback,useRef } from 'react'
import ProductList from './components/ProductList'
import ProductDetails from './components/ProductDetails'
import ProductStats from './components/ProductStats'
import useProducts from './hooks/useProducts'

function App() {
  const { products, loading, error,retry } = useProducts()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [sortOrder, setSortOrder] = useState("default")
  const searchInputRef = useRef(null)
 const handleProductClick = useCallback((product) => {
  setSelectedProduct(product)
}, [])
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
        !showInStockOnly || Boolean(product.inStock)

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
  if (loading) {
    return (
      <div>
        <h1>Product Manager</h1>
        <p>Loading products...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div>
        <h1>Product Manager</h1>
        <p>Error: {error}</p>
         <button onClick={retry}>Retry</button>
      </div>
    )
  }
  return (
    <div>
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
