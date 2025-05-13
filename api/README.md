# Support Ticket API

An API server that serves the Support Ticket platform.

## Getting started

Ensure all dependencies are installed by running the following command:

```sh
pnpm install --frozen-lockfile
```

Ensure required environment variables are set:

```sh
# Replace the placeholder with your actual values
cp .env.example .env
```

Ensure the database has been started by spinning up the Docker Compose in the project root:

```sh
docker compose up
```

Run the following command to start the server:

```sh
pnpm dev
```

Running the command above will run the migration and seeding of data.

The seeding script can be found in `./scripts/seed.ts`.

Below is the command for performing migration and seeding the database:
- `pnpm db:migrate` (perform DB migration)
- `pnpm db:seed` (perform DB seeding)
