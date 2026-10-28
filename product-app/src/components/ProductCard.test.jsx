
import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ProductCard from './ProductCard'
import CreateProductForm from './CreateProductForm'
import ProductListPage from '../pages/ProductListPage'
import ProductDetailsPage from '../pages/ProductDetailsPage'

import { renderWithProviders } from '../test/test-utils'

describe('ProductCard', () => {
  const renderProductCard = (inStock) => {
    const product = {
      id: 101,
      name: 'Keyboard',
      price: 5000,
      category: 'Electronics',
      inStock,
    }

    renderWithProviders(
      <ProductCard
        product={product}
        onSelectProduct={vi.fn()}
      />
    )
  }

  it('renders the product details correctly', () => {
    renderProductCard(true)

    expect(
      screen.getByRole('heading', { name: 'Keyboard' })
    ).toBeInTheDocument()

    expect(screen.getByText('Price: $5000')).toBeInTheDocument()
    expect(screen.getByText('Category: Electronics')).toBeInTheDocument()
    expect(screen.getByText('In Stock')).toBeInTheDocument()
  })

  it('shows Out of Stock when the product is not in stock', () => {
    renderProductCard(false)

    expect(
      screen.getByText('Out of Stock', { selector: 'p' })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Out of Stock' })
    ).toBeDisabled()
  })

  it('does not show Out of Stock when the product is in stock', () => {
    renderProductCard(true)

    expect(
      screen.queryByText('Out of Stock')
    ).not.toBeInTheDocument()

    expect(screen.getByText('In Stock')).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Add to Cart' })
    ).toBeEnabled()
  })
})

describe('CreateProductForm', () => {
  it('shows a validation error when submitted with an empty name', async () => {
    const user = userEvent.setup()

    renderWithProviders(<CreateProductForm />, {
      withRouter: true,
    })

    await user.click(
      screen.getByRole('button', { name: 'Create Product' })
    )

    expect(
      screen.getByText('Name is required')
    ).toBeInTheDocument()
  })
})

describe('ProductListPage sorting', () => {
  it('displays products from low to high price', async () => {
    const user = userEvent.setup()

    const products = [
      {
        id: 1,
        name: 'Product A',
        price: 300,
        category: 'Electronics',
        inStock: true,
      },
      {
        id: 2,
        name: 'Product B',
        price: 100,
        category: 'Electronics',
        inStock: true,
      },
      {
        id: 3,
        name: 'Product C',
        price: 200,
        category: 'Electronics',
        inStock: true,
      },
    ]

    renderWithProviders(<ProductListPage />, {
      withRouter: true,
      preloadedState: {
        products: {
          items: products,
          status: 'succeeded',
          error: null,
          createStatus: 'idle',
          createError: null,
          createFieldErrors: {},
          updateStatus: 'idle',
          updateError: null,
          updateFieldErrors: {},
          updateErrorStatus: null,
          deleteStatus: 'idle',
          deleteError: null,
          deleteErrorStatus: null,
        },
      },
    })

    const sortDropdown = screen.getByRole('combobox', {
  name: 'Sort products',
})

await user.selectOptions(sortDropdown, 'lowToHigh')

    await waitFor(() => {
      const productHeadings = screen
        .getAllByRole('heading', { level: 2 })
        .map((heading) => heading.textContent)
        .filter((name) =>
          ['Product A', 'Product B', 'Product C'].includes(name)
        )

      expect(productHeadings).toEqual([
        'Product B',
        'Product C',
        'Product A',
      ])
    })
  })
})

describe('ProductDetailsPage', () => {
  it('shows Product not found for a product ID that does not exist', () => {
    const products = [
      {
        id: 1,
        name: 'Product A',
        price: 300,
        category: 'Electronics',
        inStock: true,
      },
    ]

    renderWithProviders(<ProductDetailsPage />, {
      withRouter: true,
      route: '/products/999',
      path: '/products/:id',
      preloadedState: {
        auth: {
          user: null,
        },
        products: {
          items: products,
          status: 'succeeded',
          error: null,
          createStatus: 'idle',
          createError: null,
          createFieldErrors: {},
          updateStatus: 'idle',
          updateError: null,
          updateFieldErrors: {},
          updateErrorStatus: null,
          deleteStatus: 'idle',
          deleteError: null,
          deleteErrorStatus: null,
        },
      },
    })

    expect(
      screen.getByText('Product not found.')
    ).toBeInTheDocument()
  })
})
