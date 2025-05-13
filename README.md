# 🛠️ Support Ticket Platform

A demonstration of a mini support ticket management platform with simple AI integration generates summaries of high-priority tickets.

## ✨ Features
- Create, Edit, and Delete support tickets
- View list of tickets
- Generate AI-powered summaries of high-priority tickets (requires `OPENAI_API_KEY`)

## Getting started

### 1. Prerequisites

> [!IMPORTANT]
> This project uses PNPM package manager to manage any dependencies
> and thus, it requires PNPM to be installed.

Ensure [PNPM](https://pnpm.io/) is installed on the machine.

```sh
npm install -g pnpm
```

You'll also need:
- Docker (for the database)
- Node.js (v18 or later recommended)

### 2. Install Dependencies

From the root of the project, run:

```sh
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `api` folder using the provided `.env.example` as a template.

`cp api/.env.example api/.env`

Update the following variables in `.env`:

```sh
# Example setup (see docker-compose.yaml for details)
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<database_name>

# Optional: Required to enable the "View AI Summary" feature
OPENAI_API_KEY=<your_openai_api_key>
```

### 4. Start the database

Make sure Docker is running, then start the PostgreSQL database:

```sh
docker compose up
```

### 5. Run the App and API

Start both frontend and backend services (this also handles DB migrations and seeding):

```sh
pnpm dev
```

Once started, the services will be available at:
- Frontend: `http://localhost:5173`
- API: `http://localhost:3000`


## Demo: AI-Powered Summary

AI-generated summaries of high-priority tickets:

https://github.com/user-attachments/assets/8ec34485-2c46-4a8a-bc48-940c5c5edf20


## API Endpoints

The following API endpoints are available:

- `GET /support-tickets` - Retrieve all tickets
- `POST /support-tickets` - Create a new ticket
- `GET /support-tickets/:id` - Retrieve a ticket by ID
- `PUT /support-tickets/:id` - Update a ticket by ID
- `DELETE /support-tickets/:id` - Delete a ticket by ID
- `GET /support-tickets/summary-available` - Check for feature summary availability. Controls whether the "View AI Summary" button is visible.
- `GET /support-tickets/summary` - Retrieve AI summary of high priority tickets

## Future improvements

- Implement pagination for the `/support-tickets` endpoint.
- Add support for filtering tickets by status.
- Implement a search feature for tickets.
- Improve test coverage on the backend, e.g. integration tests for the `/support-tickets` endpoint.
- Improve test coverage on the frontend, e.g. e2e tests
