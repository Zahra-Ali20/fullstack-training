# Requirements Breakdown

## Client Requirement

Build a product listing page where users can view products, search products by name, filter products by category, sort products by price, and open a product to view its details.

## Technical Tasks

1.Product Listing
   * Fetch products from the backend.
   * Display products in a list or grid of product cards.

2.Product Search

   * Add a search input for product names.
   * Send the search term to the backend.
   * Display products matching the search term.

3.Category Filtering

   * Provide a category filter.
   * Send the selected category to the backend.
   * Display products belonging to the selected category.

4.Price Sorting

   * Provide a price sorting control.
   * Support sorting products by price.
   * Display the products in the selected price order.

5. Product Details

   * Make each product card selectable.
   * Open a product detail page using the product ID.
   * Display the selected product's details.


6. Error/Not found

   * Show a suitable message when no products match the search or filters.


## Functionality Details

### Product Listing

The system should retrieve available products from the backend and display them as product cards. Each card should show the basic product information needed by the user.

### Search

The user should be able to enter a product name in the search field. The system should use the entered search term to find matching products and update the displayed product list.

### Category Filtering

The user should be able to select a product category. The system should filter the product list according to the selected category.

### Price Sorting

The user should be able to select a price sorting option. The system should arrange the displayed products according to the selected price order(low-high,high-low).

### Product Detail Navigation

When the user selects a product card, the system should open a detail page for that specific product and load its information using the product ID.

### Loading State

While product data is being requested from the backend, the interface should show a loading indicator so the user knows that the data is being loaded.

### Empty State

If no products match the search or selected filters, the interface should display a clear message instead of showing an empty product list.

### Error State

If the product request fails because of a server or network problem, the interface should display a clear error message to the user.


## Frontend Responsibilities

* Display the product listing page and product cards.
* Provide a search input for product names.
* Provide a category filter.
* Provide a price sorting control.
* Handle user interaction with search, filters, and sorting.
* Open the product detail page when a product is selected.
* Display loading, empty, and error states.

## Backend Responsibilities

* Provide API endpoints for retrieving products.
* Accept search, category, and sorting parameters.
* Apply search and filtering logic to the product data.
* Retrieve a specific product using its ID.
* Return appropriate error responses when a request fails or a product is not found.

## Database Responsibilities

* Store product information such as product ID, name, description, price, and category.
* Store category information for products.
* Store product prices for sorting.
* Support queries required to search, filter, sort, and retrieve products by ID.



## API Requirements

Based on the product listing requirements, the following APIs are proposed.

### 1. Get Products


GET /api/products

Purpose is to Retrieve the product list.

**Query Parameters:**


?search=laptop
?category=electronics
?sort=price_asc

These parameters can be used to search, filter, and sort the product list.

**Request Responsibility:**

* The frontend sends a request to the product list endpoint.
* The frontend may include search, category, or sorting parameters.

**Response Responsibility:**

* The backend returns the matching products.
* The response should contain the product data needed to display product cards.

**Example Requests:**


GET /api/products
GET /api/products?search=laptop
GET /api/products?category=electronics
GET /api/products?sort=price_as

### 2. Get Product Details

GET /api/products/:id


Purpose is to Retrieve details of one specific product.

**Request Responsibility:**

* The frontend sends the product ID.
* Example:

GET /api/products/123


**Response Responsibility:**

* The backend returns the details of the requested product.
* If the product does not exist, the backend should return an appropriate not-found response.
* The frontend displays the returned product information on the product detail page.




## Clarification Questions

1. What should happen if the product details cannot be loaded because of a server or network error?
2. What product information should be displayed on the product detail page?
3. Should users be able to select only one category or multiple categories?
4. Should price sorting support both ascending and descending order?
5. What message should be displayed when no products match the search or selected filters?
6. Which filters would be there to search a product?


## Acceptance Criteria

1. **Product Listing**

   * Given products are available, when the user opens the product listing page, then the available products are displayed as product cards.

2. **Product Search**

   * Given products exist, when the user searches for a product name, then products matching the search term are displayed.

3. **Category Filtering**

   * Given products belong to different categories, when the user selects a category, then only products from that category are displayed.

4. **Price Sorting**

   * Given multiple products have different prices, when the user selects a price sorting option, then the products are displayed in the selected price order.

5. **Product Details**

   * Given a product is displayed, when the user selects the product, then the corresponding product detail page is opened and its information is displayed.

6. **Empty State**

   * Given no products match the search or filters, when the results are loaded, then a clear empty-state message is displayed.

7. **Error State**

   * Given the product request fails, when the listing page attempts to load the products, then a clear error message is displayed.

8. **Loading State**

   * Given the product data is being requested, when the response has not arrived yet, then a loading indicator is displayed.
