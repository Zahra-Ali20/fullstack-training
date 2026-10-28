
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import {
  MemoryRouter,
  Routes,
  Route,
} from 'react-router-dom'

import productsReducer from '../features/products/productsSlice'
import cartReducer from '../features/cart/cartSlice'
import authReducer from '../features/auth/authSlice'
import ticketsReducer from '../features/tickets/ticketsSlice'

const rootReducer = {
  products: productsReducer,
  cart: cartReducer,
  auth: authReducer,
  tickets: ticketsReducer,
}

export function renderWithProviders(
  ui,
  {
    preloadedState,
    store,
    withRouter = false,
    route = '/',
    path,
    ...renderOptions
  } = {}
) {
  const testStore =
    store ??
    configureStore({
      reducer: rootReducer,
      preloadedState,
    })

  function Wrapper({ children }) {
    const content = withRouter ? (
      <MemoryRouter initialEntries={[route]}>
        {path ? (
          <Routes>
            <Route path={path} element={children} />
          </Routes>
        ) : (
          children
        )}
      </MemoryRouter>
    ) : (
      children
    )

    return (
      <Provider store={testStore}>
        {content}
      </Provider>
    )
  }

  return {
    store: testStore,
    ...render(ui, {
      wrapper: Wrapper,
      ...renderOptions,
    }),
  }
}
