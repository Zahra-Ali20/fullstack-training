# Validation and Errors
## Validation Rules
* name: Required, trimmed, between 2 and 100 characters.
* price: Required and must be greater than 0.
* category: Required, trimmed, maximum 50 characters.
* inStock: Optional boolean value.
* id: Must be a positive integer.
## Error Contract
* 422 Validation Error
Returned when request data fails validation.
Example:
{
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
* 404 Not Found
Returned when the requested product or route does not exist.
Example:
{
  "error": "Product not found"
}
* 500 Internal Server Error
Returned when an unexpected server error occurs. The client receives a generic message instead of internal technical details.
Example:
{
  "error": "Internal server error"
}
## Middleware Flow
Route → Validator → validateRequest → Controller
The validator defines the rules. The validation middleware checks the results and returns a 422 response if validation fails. Otherwise, it calls next() so the controller can handle the request.
## Centralized Error Handling
The application uses one error-handling middleware to keep error responses consistent. Controllers pass errors using next(error), and the centralized handler decides the HTTP status and response message.