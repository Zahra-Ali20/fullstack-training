# Part 42: SPA Routing in Production

## What Is an SPA?

SPA stands for **Single Page Application**. Our React frontend uses React Router to display different pages without loading a completely new HTML page for every route.

Examples of frontend routes:
- `/products/5`
- `/tasks/3`
- `/login`

## Why Is SPA Fallback Needed?

During development, we can navigate between frontend routes using React Router.

In production, when someone opens `/products/5` directly or refreshes that page, the browser sends a request for that URL to the hosting server.

The server might look for a physical file at that path and return a 404 error because `/products/5` is a React route, not an actual file.

## SPA Fallback Requirement

The production hosting server should serve the frontend `index.html` when a frontend route is requested directly.

React then loads, React Router reads the URL, and the correct page is displayed.

**In simple words:** SPA fallback prevents valid React routes from showing a server 404 when opened directly or refreshed.

## Routes to Verify After Deployment

- `/products/5`
- `/tasks/3`
- `/login`



