import { Routes, Route } from 'react-router-dom'
import ProductListPage from './pages/ProductListPage'
import CreateProductPage from './pages/CreateProductPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import Header from './components/Header'
import Cart from './components/Cart'
function App() {
  return (
    <>
      <Header />
      <Routes>
  <Route path="/" element={<ProductListPage />} />
  <Route path="/products/new" element={<CreateProductPage />} />
  <Route path="/products/:id" element={<ProductDetailsPage />} />
  <Route path="/cart" element={<Cart />} />
</Routes>
    </>
  )
}

export default App