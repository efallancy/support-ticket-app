# Support Ticket Platform

A demonstration of a mini support ticket management platform with simple AI integration that provides
summary of high priority tickets.

## Getting started

> [!IMPORTANT]
> This project uses PNPM package manager to manage any dependencies
> and thus, it requires PNPM to be installed.

Ensure all relevant dependencies are installed, by running the following command:

```sh
pnpm install --frozen-lockfile
```

Before running any services, ensure the environment variables are set correctly in `.env` file in `api` folder.

```sh
# There is a template file named .env.example that contains the required environment variables in api folder.

# Refer to docker-compose.yaml for the user, password, and database name as configured in the docker-compose.yaml file
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<database_name>

# If not configured, the "View AI Summary" button will not be visible
OPENAI_API_KEY=<your_openai_api_key>
```

Start the database by running the following command in the project root:

```sh
docker compose up
```

To start the services, run the following command:

```sh
pnpm dev
```

Running the command above will spin up the app and API services.

For convenience on spinning up the services, it will attempt on running the DB migration and seed the data.

By default, the app and API will be started in:
- `http://localhost:5173` (App)
- `http://localhost:3000` (API)

## API Endpoints

The following API endpoints are available:

- `GET /support-tickets` - Retrieve all tickets
- `POST /support-ickets` - Create a new ticket
- `GET /support-tickets/:id` - Retrieve a ticket by ID
- `PUT /support-tickets/:id` - Update a ticket by ID
- `DELETE /support-tickets/:id` - Delete a ticket by ID
- `GET /support-tickets/summary-available` - Check for feature summary availability. Controls whether the "View AI Summary" button is visible.
- `GET /support-tickets/summary` - Retrieve AI summary of high priority tickets

## Screen captures

Basic functionality

<video src="assets/basic-functionality-overview.mp4"></video>

---

Generating support tickets summary with AI

<video src="assets/generate-summary-with-ai.mp4"></video>
