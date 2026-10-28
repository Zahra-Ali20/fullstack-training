# Part 44: Environment-Specific URLs

## Purpose

Frontend and backend URLs can differ between development, staging, and production environments.

Keeping environment-specific URLs separate helps the application connect to the correct backend in each environment.

## 1. Development

Used for local development and testing.

- Frontend: `http://localhost:5173`
- Products/Auth API: `http://localhost:3000`
- Tasks API: `http://localhost:3001`

## 2. Staging

Used to test the application in a deployed environment before production.

- Frontend: `https://staging.example.com` (placeholder)
- Backend: `https://api-staging.example.com` (placeholder)

## 3. Production

Used by actual users of the live application.

- Frontend: `https://your-production-domain.example` (placeholder)
- Backend: `https://your-production-api.example` (placeholder)

These production and staging URLs are examples only. They are not actual deployed domains.


