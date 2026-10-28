
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ProtectedRoute({ allowedRoles }) {
  const token = useSelector((state) => state.auth.token)
  const user = useSelector((state) => state.auth.user)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role?.toLowerCase())) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
