# Part 39: Create Form Review Notes

## Controlled Components

An input is controlled when React state manages its value. The input value is updated through an `onChange` handler.

## Form State

Form input state is local because it is mainly needed by the Create Product form. It does not need to be shared across the whole application.

## Client Validation

Client validation catches invalid input before sending a request to the backend. It gives users quick feedback and avoids unnecessary API requests.

## Backend Validation

Backend validation is still required because users can bypass frontend validation and send requests directly to the API. The backend protects data integrity and enforces the rules.

## 422 Errors

When the backend returns a 422 validation error, the frontend reads the response and maps the validation messages to the relevant form fields. These messages are displayed beside their inputs.

## rejectWithValue

`rejectWithValue` allows a Redux Toolkit async thunk to return a meaningful error payload when an API request fails. The rejected action can then use that payload to display validation or submission errors.

## Pending State

The submit button is disabled while saving to prevent duplicate submissions and show that the request is in progress.

## Successful Creation

After successful creation, the frontend can add the product returned by the API to the Redux products state. This updates the product list without fetching all products again.

## Failed Creation

Form values should remain after failure so users do not lose their work. They can correct the problem or retry without entering everything again.

## Error Types

A field error relates to a specific input, such as an invalid price. A general submission error relates to the whole request, such as a server or network failure, and is displayed separately from individual fields.