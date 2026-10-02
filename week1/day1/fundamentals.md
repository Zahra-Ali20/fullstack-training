# Part 1: Frontend, Backend & Database

## Frontend

The frontend is the part of an application that the user can see and interact with.

* User Interface: It includes buttons, menus, forms, input fields, images, and other visual elements.
* User Interaction: Users can click buttons, enter information, select options, and submit forms.
* Collecting Input: The frontend collects information entered by the user, such as email and password.
* Sending Requests: The frontend sends HTTP requests to the backend, for example POST /login.
* Displaying Data: The frontend receives data from the backend and displays it to the user.

## Backend

The backend handles the application's logic and data processing.

* Receiving HTTP Requests: The backend receives requests from the frontend.
* Processing Application Logic: It processes the request according to the application's rules.
* Validation: It checks whether the received data is valid and complete.
* Communicating with Database: The backend communicates with the database to store, retrieve, update, or delete data.
* Returning Responses: After processing the request, the backend sends a response back to the frontend.

## Database

A database is used to store and manage application data.

* Storing Data: It stores information such as users, products, orders, and other application data.
* Retrieving Data: It allows the application to retrieve required data.
* Updating Data: It allows existing data to be updated when needed.
* Maintaining Relationships: It maintains relationships between related data, such as users, orders, and order items.


The frontend collects user input and sends a request to the backend. The backend processes the request and communicates with the database when required. The backend then sends a response back to the frontend, and the frontend displays the result to the user.

# Part 2: Request/Response Flow

Example: User Login

1. User enters email and password.

   Example:
   Email = zahra@gmail.com
   Password = 123456

2. Frontend collects the email and password entered by the user.

3. Frontend sends an HTTP request to the backend.

   Example:
   `POST /login`

   The request contains the email and password.

4. Backend receives the request and reads the data.

5. Backend validates and processes the request.

   It checks that the email and password are provided and that the data is valid.

6. Backend communicates with the database to check the user's information.

7. Database returns the required user data to the backend.

8. Backend creates a response.

   If login is successful:
   `200 OK - Login successful`

   If login fails:
   `401 Unauthorized - Invalid credentials`

9. Frontend receives the response from the backend.

10. UI updates according to the response.

If login is successful, the user is redirected to the dashboard.

If login fails, the UI shows:
`Invalid email or password.`

# Part 3: MongoDB vs MySQL

MongoDB and MySQL are both databases, but they store and organize data differently.

1. Data Storage

MongoDB stores data in collections and documents.

MySQL stores data in tables, which contain rows and columns.

2. Schema

MongoDB has a flexible schema. Documents in the same collection can have different fields.

MySQL has a defined schema. The table structure and columns are defined before storing data.

3. Data Relationships

MongoDB is document-based and can store related information together inside a document when needed.

MySQL is a relational database and stores related data in separate tables. These tables can be connected using relationships.



MySQL is useful when an application has related data, such as users, products, orders, and order items. It stores this data in separate tables and connects the tables using relationships. For example, a user can have multiple orders, and each order can contain multiple products.

# Part 4: SDLC & Agile Basics

SDLC stands for Software Development Life Cycle. It is the process used to develop and maintain software.

### 1.Requirements

In this step, the team understands what the user or client needs from the software.

### 2.Planning

The team plans the work, resources, time, and tasks needed to build the software.

### 3.Development

Developers write the code and build the required features.

### 4.Testing

The software is tested to find bugs and make sure the features work correctly.

### 5.Deployment

The completed software is released so users can use it.

### 6.Maintenance

After deployment, developers fix bugs, update the software, and improve existing features to maintain quality.

# Agile Concepts

### Sprint

A sprint is a short period in which the team works on a specific set of tasks or features.

### User Story

### A user story describes a feature from the user's point of view.

Example:
As a user, I want to log in so that I can access my account.

### Task

A task is a smaller piece of work needed to complete a user story.

### Daily Stand-up

A daily stand-up is a short meeting where team members discuss what they did, what they will do, and if they have any blockers.

### Acceptance Criteria

Acceptance criteria are the conditions that a feature must meet to be considered complete.

### Code Review

Code review is when another developer checks the code to find issues and make sure the code is clear and follows good practices.

### Pull Request

A pull request is a request to review code before merging it into the main or shared codebase.

# Developer's Daily Work in an Agile Sprint:

During an Agile sprint, a developer works on assigned user stories and tasks. The developer attends the daily stand-up, writes and tests code, and creates a pull request when the work is ready. Another developer reviews the code, and the developer makes changes if needed before the code is merged into main codebase.

