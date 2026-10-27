# Redux Review Notes

## 1. Local State vs Global State

Local state is used for data that is needed only in a specific component or page.

Global state is used for data that needs to be shared between multiple components.

In our Product app:
- Search term, category, stock filter, and sorting are local state because they control the product list UI.
- Products and cart items are stored in Redux because multiple components need access to them.

## 2. Redux Store

The Redux store is the central place where global application state is stored.

In our Product app, the store contains:
- Products, loading status, and API error.
- Cart items and their quantities.

Components can access this state using `useSelector`.

## 3. Action

An action describes what happened in the application.

For example:
- `cart/addToCart`
- `cart/removeFromCart`
- `cart/updateQuantity`

An action can also carry data, such as the product to add to the cart.

## 4. Reducer

A reducer determines how the state changes when an action occurs.

For example, the `addToCart` reducer adds a product to the cart or increases its quantity if the product already exists.

Reducers should not perform API requests or other side effects.

## 5. Dispatch

Dispatch sends an action to the Redux store.

For example:

`dispatch(addToCart(product))`

This sends the `addToCart` action with the product data. Redux then runs the appropriate reducer to update the state.

## 6. Selector

`useSelector` reads data from the Redux store.

For example:

`useSelector((state) => state.products.items)`

This selects the products array from the Redux state.

When the selected state changes, React Redux can cause the component to render again.

## 7. createSlice

`createSlice` helps us create a Redux slice with less boilerplate code.

It generates:
- Action creators.
- Action types.
- A reducer.

For example, our cart slice defines actions such as `addToCart`, `removeFromCart`, and `updateQuantity`.

## 8. createAsyncThunk

`createAsyncThunk` handles the lifecycle of asynchronous operations, such as fetching products from an API.

It generates three main action types:

- `pending`: The request has started.
- `fulfilled`: The request completed successfully.
- `rejected`: The request failed.

These actions are similar to the states of a Promise:
- Pending means the operation is still in progress.
- Fulfilled means it succeeded.
- Rejected means it failed.

Our products slice uses these actions to manage loading status, products, and API errors.

## 9. Derived State

Derived state is calculated from existing state instead of being stored separately.

For example, the cart total is calculated using each item's price multiplied by its quantity.

We should not store the cart total separately because it could become inconsistent when cart items or quantities change.

Calculating the total from the current cart items keeps the result accurate.

## 10. Persistence

Redux state is stored in memory by default. It is not automatically saved to persistent browser storage.

When the browser refreshes, the application starts again and the Redux store is initialized with its initial state.

In our Product app, the cart becomes empty after refresh because its initial state contains an empty items array.

To preserve the cart across refreshes, we would need to implement persistence, for example using localStorage. Persistence is not required for this task.

## 11. Redux Toolkit and Mutation-Like Code

Redux Toolkit uses Immer internally to handle immutable state updates.

This allows us to write reducer code that looks like it directly changes the state, for example:

`state.items.push(action.payload)`

Immer tracks these changes and produces a new state immutably.

This makes reducer code easier to write while preserving Redux's immutability requirements.
