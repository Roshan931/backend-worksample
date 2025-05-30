# Backend Engineer Work Sample

This project contains a basic Express setup with one endpoint to create a user and one endpoint to fetch all users and integration tests covering both endpoints.

## Prerequisites

Before starting the project with `npm start`, you need to start a PostgreSQL database locally using Docker. This setup only needs to be done once.

From the project root directory, run:

```bash
./run_db.sh
```

This will start a new PostgreSQL instance in Docker.

Environment variables needed to connect to the database are already provided in the `.env.example` file. To configure your local environment, copy this file to `.env`:

```bash
cp env.example .env
```

After the database is running and the `.env` file is in place, you can start the application with:

```bash
npm start
```

## Running Tests

You can run the tests at any time using:

```bash
npm test
```

The tests do not require a running database. All database calls are mocked.
