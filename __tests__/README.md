# API Testing for Nutri-Flex

This directory contains tests for the Nutri-Flex API endpoints. The tests use Jest as the testing framework and an in-memory MongoDB server to ensure they don't affect the actual database.

## Test Structure

- `__tests__/api/workouts.test.ts`: Tests for the workouts API endpoints (CRUD operations)
- `__tests__/utils/test-db.ts`: Utility functions for setting up and tearing down the test database

## What's Being Tested

The tests cover all CRUD operations for the workouts API:

1. **GET /api/workouts**: Retrieving all workouts
2. **POST /api/workouts**: Creating a new workout
3. **GET /api/workouts/[id]**: Retrieving a specific workout by ID
4. **PUT /api/workouts/[id]**: Updating a workout
5. **DELETE /api/workouts/[id]**: Deleting a workout

Each operation is tested for both success and error cases, including:
- Valid data
- Invalid data (missing required fields)
- Invalid IDs
- Non-existent resources
- Relationships with exercises

## Test Database

The tests use `mongodb-memory-server` to create an in-memory MongoDB server for testing. This ensures that the tests don't affect the actual database and can be run in isolation.

The test database is set up before all tests, cleared after each test, and torn down after all tests.

## Running the Tests

To run the tests, use the following command:

```bash
npm test
```

Or to run the tests in watch mode:

```bash
npm run test:watch
```

## Adding More Tests

To add more tests for other API endpoints, follow the same pattern as the workouts tests:

1. Create a new test file in the `__tests__/api` directory
2. Import the necessary functions from the API routes
3. Use the test database utility functions to set up and tear down the database
4. Write tests for all CRUD operations and edge cases
