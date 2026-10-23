
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import ProductListPage from './pages/ProductListPage'
import CreateProductPage from './pages/CreateProductPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import TaskListPage from './pages/TaskListPage'
import Header from './components/Header'
import Cart from './components/Cart'
import TaskDetailPage from './pages/TaskDetailPage'
import CreateTaskPage from './pages/CreateTaskPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import { logout } from './features/auth/authSlice'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(logout())
      window.location.assign('/login')
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [dispatch])

  return (
    <>
      <Header />

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/tasks/new" element={<CreateTaskPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
        </Route>

        <Route
          element={<ProtectedRoute allowedRoles={['manager', 'admin']} />}
        >
          <Route path="/products/new" element={<CreateProductPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
