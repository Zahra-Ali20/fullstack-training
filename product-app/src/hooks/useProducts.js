import { useState, useEffect } from 'react'

function useProducts() {
const [products, setProducts] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
const [retryCount, setRetryCount] = useState(0)
useEffect(() => {
  const controller = new AbortController()

  async function fetchProducts() {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/products`,
        { signal: controller.signal }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(
          'Unable to load products. Please check your connection and try again.'
        )
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }

  fetchProducts()

  return () => {
    controller.abort()
  }
}, [retryCount])
const retry = () => {
  setRetryCount((count) => count + 1)
}

return { products, loading, error, retry }
}
export default useProducts;