import { Routes, Route } from 'react-router-dom'
import ProductListPage from './pages/ProductListPage'
import CreateProductPage from './pages/CreateProductPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import TaskListPage from './pages/TaskListPage'
import Header from './components/Header'
import Cart from './components/Cart'
import TaskDetailPage from './pages/TaskDetailPage'
import CreateTaskPage from './pages/CreateTaskPage'
function App() {
  return (
    <>
      <Header />
    <Routes>
  <Route path="/" element={<ProductListPage />} />
  <Route path="/products/new" element={<CreateProductPage />} />
  <Route path="/products/:id" element={<ProductDetailsPage />} />
  <Route path="/cart" element={<Cart />} />

  <Route path="/tasks" element={<TaskListPage />} />
  <Route path="/tasks/new" element={<CreateTaskPage />} />
  <Route path="/tasks/:id" element={<TaskDetailPage />} />
</Routes>
    </>
  )
}

export default App