import { Link } from 'react-router-dom'

function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Products</Link>
        {' | '}
        <Link to="/products/new">Create Product</Link>
        {' | '}
        <Link to="/cart">Cart Summary</Link>
      </nav>
    </header>
  )
}

export default Header