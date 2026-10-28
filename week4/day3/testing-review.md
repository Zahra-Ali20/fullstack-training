# Part 50: Testing Review Document

## 1. Unit vs Integration Testing

**Unit testing** checks one small piece of code in isolation, such as a function or service method.

**Integration testing** checks whether multiple parts work together correctly, such as a route, middleware, service, and database interaction.

## 2. Supertest

Supertest allows us to test HTTP endpoints by sending requests to an Express application and checking the response status, body, and headers.

For example, we can test whether `GET /api/products` returns the expected products.

## 3. Service Layer

A Service Layer improves testability because business logic is separated from controllers and routes.

We can test service methods independently by supplying mock dependencies and checking their results without sending HTTP requests.

## 4. Database Boundary

We should mock `mysql2` or Sequelize when testing business logic without needing a real database.

We should use a real test database when we need to verify actual SQL queries, database constraints, relationships, or persistence behavior.

## 5. Sequelize

To unit test a service that calls `Product.findByPk()`, we can mock `Product.findByPk()` and control its return value.

For example, we can make it return a sample product to test the success case, or `null` to test the product-not-found case. We should also verify that it was called with the expected ID.

## 6. Authentication

Test JWTs should be generated during tests using the test signing secret and appropriate claims.

This avoids expired or outdated tokens, makes tests repeatable, and allows us to control the user's ID, role, and token validity.

## 7. 401 vs 403

Automated tests should verify that `401` is returned when authentication is missing or invalid.

They should verify that `403` is returned when an authenticated user does not have the required permission.

Tests should also check the response body to ensure the correct error is returned.

## 8. React Testing Library

Tests should focus on user-visible behavior because users interact with the interface, not the internal implementation.

For example, we should test whether a product appears on the page or an error message is displayed instead of checking private component state.

## 9. Redux

A controlled Redux test store is useful because it allows us to provide predictable initial state, dispatch actions, and inspect state changes.

This helps us test loading, success, and error states without depending on the application's real store or unrelated features.

## 10. Mocking

Mocking too much can make tests pass even when the real application is broken.

For example, mocking every service and database interaction may hide integration problems. We should mock only the dependencies needed for the test and test important integrations separately.

## 11. Test Independence

Tests should not depend on execution order because each test must produce a predictable result regardless of which tests ran before it.

Tests should use their own setup and clean up any shared state or test data when necessary.

This makes the test suite more reliable and easier to debug.

## 12. Error Contracts

Tests should verify response bodies as well as status codes because a status code alone does not confirm that the correct error was returned.

For example, a test should verify both the `404` status and the expected error message or response structure. This ensures the API follows its documented error contract.


