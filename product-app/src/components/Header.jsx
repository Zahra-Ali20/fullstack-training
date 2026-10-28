
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((state) => state.auth.user)
  const role = user?.role?.toLowerCase()

  const canManageProducts = role === 'manager' || role === 'admin'

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <header>
      <nav>
        <Link to="/">Products</Link>
        {' | '}

        {canManageProducts && (
          <>
            <Link to="/products/new">Create Product</Link>
            {' | '}
          </>
        )}

        <Link to="/tasks">Tasks</Link>
        {' | '}
        <Link to="/tasks/new">Create Task</Link>
        {' | '}
        <Link to="/tickets">Tickets</Link>
        {' | '}
        {user && (
          <>
            <Link to="/tickets/new">Create Ticket</Link>
            {' | '}
          </>
        )}
        <Link to="/cart">Cart Summary</Link>
        {' | '}

        <span>
          {user?.name || user?.email || 'Logged in'}
          {role ? ` (${role})` : ''}
        </span>
        {' | '}

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </header>
  )
}

export default Header

