import { useState } from 'react'
import ProductList from './components/ProductList'
import ProductDetails from './components/ProductDetails'
import ProductStats from './components/ProductStats'

function App() {
  const products = [
    {
      id: 1,
      name: "Laptop",
      price: 1200,
      category: "Electronics",
      inStock: true
    },
    {
      id: 2,
      name: "Mouse",
      price: 500,
      category: "Electronics",
      inStock: true
    },
    {
      id: 3,
      name: "Coffee Maker",
      price: 1500,
      category: "Kitchen",
      inStock: false
    },
    {
      id: 4,
      name: "Backpack",
      price: 50,
      category: "Accessories",
      inStock: true
    },
    {
      id: 5,
      name: "Toaster",
      price: 15000,
      category: "Kitchen",
      inStock: false
    }
  ]

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [sortOrder, setSortOrder] = useState("default")

  const clearFilters = () => {
  setSearchTerm("")
  setSelectedCategory("All")
  setShowInStockOnly(false)
  setSortOrder("default")
  setSelectedProduct(null)
}
  console.log("SELECTED PRODUCT:", selectedProduct)

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory

    const matchesStock =
      !showInStockOnly || product.inStock === true

    return matchesSearch && matchesCategory && matchesStock
  })
  const sortedProducts = [...filteredProducts]
  if (sortOrder === "lowToHigh") {
  sortedProducts.sort((a, b) => a.price - b.price)
}

if (sortOrder === "highToLow") {
  sortedProducts.sort((a, b) => b.price - a.price)
}


  return (
    <div>
      <h1>Product Manager</h1>
      <ProductStats products={products} />

      <input
        type="text"
        placeholder="Search products"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Electronics">Electronics</option>
        <option value="Kitchen">Kitchen</option>
        <option value="Accessories">Accessories</option>
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
  
  
   <button onClick={clearFilters}>
      Clear Filters
  </button>
      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ProductList
          products={sortedProducts}
          onSelectProduct={setSelectedProduct}
        />
      )}

      <ProductDetails product={selectedProduct} />
    </div>
  )
}

export default App