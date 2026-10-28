import CreateProductForm from '../components/CreateProductForm'
import { Link } from 'react-router-dom'

function CreateProductPage() {
  return (
    <div>
      <nav>
        <Link to="/">Back to Products</Link>
      </nav>

      <h1>Create Product</h1>
      <CreateProductForm />
    </div>
  )
}

export default CreateProductPage
