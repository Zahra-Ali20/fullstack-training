# Week 3 Frontend Review

## 1. Hooks

### useState
`useState` is used to store local component state that changes over time, such as form inputs, search terms, and selected filters.

### useEffect
`useEffect` is used to perform side effects, such as fetching tasks from the API when a component loads.

### useMemo
`useMemo` caches the result of an expensive calculation, such as filtering and sorting a large task list.

### useCallback
`useCallback` caches a function reference between renders. It is useful when passing callbacks to memoized child components.

### useRef
`useRef` stores a value without causing a re-render when it changes. It can also be used to access DOM elements, such as focusing an input.

## 2. Redux

**Which state in the Tasks module belongs in Redux and which stays local?**

Tasks data, API loading status, and API errors belong in Redux because multiple components may need them. Shared task data should remain consistent across pages.

Form inputs, temporary validation errors, search terms, and other page-specific UI state usually stay local because they are only needed by one component or page.

## 3. Async Thunks

**What happens from `dispatch(fetchTasks())` until the UI receives data?**

1. The component dispatches `fetchTasks()`.
2. Redux Toolkit dispatches the `pending` action.
3. The thunk sends a request to the Tasks API.
4. The backend processes the request and returns a response.
5. If successful, the thunk dispatches `fulfilled` with the returned data. If unsuccessful, it dispatches `rejected`.
6. The Redux reducer updates the tasks state, loading status, or error.
7. Components using `useSelector` receive the updated state and React re-renders the UI.

## 4. Derived State

**Why isn't the filtered task list stored separately?**

The filtered task list can be calculated from the original tasks and current filters. Storing both separately can create duplicate state and synchronization problems. We derive the filtered list when needed.

## 5. Forms

**Why do Create and Edit use local controlled form state?**

Form inputs are temporary values that change while the user types. Local controlled state lets React manage these values, validate them, and handle submission. The data is sent to the backend when the user saves the form.

## 6. Validation

**Why do both frontend and backend validation exist?**

Frontend validation provides quick feedback and improves the user experience. Backend validation protects the database and API because requests can bypass frontend checks. Backend validation is essential for security and data integrity.

## 7. Routing

**Why can Redux be empty after directly opening `/tasks/5`?**

Redux state is usually stored in memory. Refreshing the browser or directly opening `/tasks/5` starts a new frontend application instance, so the Redux store may be empty. The page should fetch the required task data from the API using the task ID in the URL.

## 8. Errors

**How do you distinguish 422, 404, and 500?**

- **422 Unprocessable Entity:** The request data failed validation.
- **404 Not Found:** The requested task or resource does not exist.
- **500 Internal Server Error:** An unexpected error occurred on the server.

## 9. CRUD

**How does Redux remain synchronized after Create, Update, and Delete?**

- **Create:** After a successful API request, Redux adds the newly created task.
- **Update:** After a successful API request, Redux updates the matching task.
- **Delete:** After a successful API request, Redux removes the deleted task.

The reducers update the store, and components using `useSelector` re-render with the latest state. The Redux state should only reflect successful server operations.

## 10. Optimization

**When are `useMemo`, `useCallback`, and `React.memo` useful, and when can they add unnecessary complexity?**

- `useMemo` is useful for expensive calculations that do not need to run on every render.
- `useCallback` is useful when a stable function reference helps prevent unnecessary renders or effect executions.
- `React.memo` is useful when a component can skip rendering because its props have not changed.

These optimizations can add unnecessary complexity when calculations are cheap, components are small, or props change on every render. They should be used when there is a clear performance benefit.

## 11. Backend Architecture Connection

### Where does the Service Layer sit between the controller and database?

The Service Layer sits between the controller and the database access layer. The controller handles HTTP requests and responses, the service contains business logic, and the database layer handles data operations.

### If the Tasks API currently uses mysql2, where would Sequelize fit?

Sequelize would replace the direct SQL/database access code with an ORM-based data access approach. Models represent database tables, and Sequelize provides methods for querying and modifying data. The controller and service layers can continue to handle HTTP and business logic.

### Would moving from mysql2 to Sequelize require changes to React or Redux? Why or why not?

Usually, no. React and Redux communicate with the backend through API endpoints and JSON responses. If the API endpoints, request formats, and response formats remain the same, the frontend does not need to know whether the backend uses mysql2 or Sequelize.

### What is the relationship between Task, Creator, Assignee, and User?

A Task is a record representing a piece of work. A User is a person who uses the application.

- **Creator:** The User who created the task.
- **Assignee:** The User responsible for completing the task.
- **User:** The person represented by a user record in the database.

Creator and Assignee are both relationships between Task and User. A task may have different users as its creator and assignee. The assignee may also be optional if the task has not been assigned.

### Why should Sequelize models not be accessed directly from React or Redux?

Sequelize runs on the backend, where database credentials and database access belong. React and Redux run in the frontend and should communicate with the backend through API requests.

Keeping this separation protects database credentials, improves security, and separates frontend responsibilities from backend implementation details.



### Tasks API Security Status

- **Frontend route protection:** Verified. After logout, navigating to `/tasks` redirects to the login page.
- **Backend authentication:** Not implemented on the tested `GET /api/tasks` endpoint. A request without an Authorization token returned `200 OK` with task data.
- **Role-based authorization (RBAC):** Not implemented. User, Manager, and Admin are not restricted by role on task CRUD operations under the current implementation.
- **CRUD integration:** Task List, Task Detail, Create, Update, and Delete were tested successfully.

**Conclusion:** The Tasks frontend and CRUD integration work, but frontend route protection does not secure the Tasks API itself.
