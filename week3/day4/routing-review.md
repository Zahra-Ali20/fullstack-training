# Part 41: Create Routing Review Notes

## Client-Side Routing

React Router lets users navigate between pages without reloading the entire application.

## Dynamic Routes

`/products/:id` is a dynamic route where `:id` represents a product's ID, such as `/products/5`.

## useParams

`useParams` returns the route parameters as strings because URL parameters are text. We can convert the ID to a number when needed.

## useNavigate

I used `useNavigate` to navigate programmatically after actions such as successfully creating or updating a product.

## Hard Refresh

Redux state is stored in memory by default. Opening `/products/5` directly or refreshing the page can reset Redux state. The product data must be fetched from the API again.

## Product Not Found

"Not loaded yet" means the product data is still loading or has not been fetched. "Does not exist" means the request has completed and the API confirms that the product was not found, usually with a `404` response.

## Update

After a successful PUT request, Redux updates the product state using the updated product returned by the API.

## Delete

After a successful DELETE request, Redux removes the deleted product from its state. The cart also removes that product after the delete succeeds.

## 204

A `204 No Content` response has no response body. Calling `response.json()` on it can throw an error, so we should not parse JSON when the response status is `204`.

## Error Handling

- **404 Not Found:** The requested product or resource does not exist.
- **422 Unprocessable Content:** The request reached the server, but the submitted data failed validation.
- **500 Internal Server Error:** An unexpected error occurred on the server.
