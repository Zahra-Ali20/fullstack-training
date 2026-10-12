# Feature Breakdown: Shopping Cart
# Client Requirement:
Users should be able to add products to a shopping cart, change quantities, remove products, and see the total price.


## Functional Requirements

* User should be able to add a product to the shopping cart.
* User should be able to change the quantity of a product in the cart.
* User should be able to remove a product from the cart.
* User should be able to view the total price of the cart.

## Frontend Responsibilities

The frontend should provide the user interface for managing the shopping cart.

Possible components may include:

* Product List component to display available products.
* Product Card component with an Add to Cart button.
* Shopping Cart component to display selected products.
* Cart Item component to display each product, quantity, and price.
* Quantity controls to increase or decrease the product quantity.
* Remove button to remove a product from the cart.
* Cart Total component to display the total price.


## Backend Responsibilities

The backend may eventually be responsible for:

* Creating and managing the user's shopping cart.
* Adding products to the cart.
* Updating product quantities.
* Removing products from the cart.
* Validating that the requested product exists.
* Checking product availability and stock.
* Returning the user's current cart.
* Calculating or validating the cart total before checkout.

## Database Responsibilities

If the cart needs to remain unchanged, the database may store:

* Cart ID.
* User ID.
* Product ID.
* Product quantity.
* Product price or the required price information.
* Cart creation date.
* Cart update date.


## API Requirements

Possible API endpoints may include:

* `GET /cart` — Get the current user's cart.
* `POST /cart/items` — Add a product to the cart.
* `PUT /cart/items/:id` — Update the quantity of a cart item.
* `DELETE /cart/items/:id` — Remove a product from the cart.

## Clarification Questions

1. Should users be logged in before they can use the shopping cart?
2. Should the cart remain saved after the user logs out?
3. Should the cart be available for guest users?
4. What should happen if a product becomes out of stock after it has been added to the cart?
5. Is there a maximum quantity that a user can add for one product?
6. Should the cart use the current product price or the price at the time the product was added?
7. Should users be able to add the same product multiple times, or should the quantity increase instead?
8. Should the cart total include taxes, discounts, or delivery charges?

## Acceptance Criteria

1. Given that a product is available, when the user adds the product to the cart, then the product should appear in the cart.

2. When the user increases the quantity of a cart item, then the displayed quantity should increase accordingly.

3. When the user decreases the quantity of a cart item, then the displayed quantity should decrease accordingly.

4. When the user removes a product from the cart, then that product should no longer appear in the cart.

5. When the quantity of a product changes, then the cart total should be recalculated correctly.

6. When a product is added to the cart, then the cart total should include the price of that product multiplied by its quantity.

7. If a requested product is unavailable or out of stock, then the system should prevent the user from adding an unavailable quantity to the cart.
