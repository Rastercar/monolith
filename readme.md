# Rastercar monolith

The core part of the rastercar platform, its a sveltekit application where the frontend and nearly all crud
operations and bussiness logic is.

## Before developinng

install the latest `NodeJS LTS` version and `pnpm`, we recommend [ASDF](https://asdf-vm.com/) to manage your node versions

## Dev Enviroment

This service depends on some infrastructure to run (database, jaeger and rabbitmq), theres a `docker-compose`
file in the [dev utils repo](https://github.com/Rastercar/dev_utils) for quickly setting up the dev enviroment 

## Quick start

```bash
# start dev dependencies containers
cd (dev_utils_repo_location) && make start_deps

# install dependencies
pnpm i

# create your dev env vars (ask for the needed keys)
cp ./env/.env.example ./env/.env.development

# run the app in development mode
# if this is your first time running the app,
# set DATABASE_SEED_ON_STARTUP=true
# on your env vars and then set it to false latter
pnpm run:dev
```

## Ports

When build for production this Monolith exposes a single port for all HTTP traffic

| PORT  | PROTOCOL |
| ----- | -------- |
| 3000  | HTTP     |

## Environment variables

| Name                             | Meaning                                                                 |
|----------------------------------|-------------------------------------------------------------------------|
| JAEGER_URL                       | Jaeger connection URL                                                   |
| RABBITMQ_URL                     | RabbitMQ connection URL                                                 |
| DATABASE_URL                     | Database connection URL                                                 |
| DATABASE_QUERY_LOGGING           | If queries should be logged to stdout                                   |
| DATABASE_QUERY_LOGGING_FORMATTED | If logged queries should be formatted                                   |
| DATABASE_NOTICE_LOGGING          | If notices should be logged to stdout                                   |
| DATABASE_SEED_ON_STARTUP         | If the database should be seeded on startup                             |
| AWS_REGION                       | AWS region                                                              |
| AWS_S3_BUCKET                    | S3 bucket where all files will be uploaded                              |
| OTEL_DIAG_LOG_LEVEL              | OpenTelemetry diagnostic debugging level                                |
| OTEL_EXPORT_SPANS_TO_STDOUT      | If OpenTelemetry spans should be exported to stdout                     |
| PUBLIC_CLOUDFRONT_BASE_URL       | CloudFront URL for displaying public photos                             |
| PUBLIC_GOOGLE_MAPS_API_KEY       | Google Maps API key                                                     |
| PUBLIC_GOOGLE_MAPS_MAP_ID        | Google Maps Map ID                                                      |

> see [/env/.env.example](/env/.env.example) for more info

## Testing

Tests are separated into vitest workspaces, defined [here](vitest.workspace.ts)

>running integrationn and e2e tests requires a test database and other dependencies,
see the [dev utils repo](https://github.com/Rastercar/dev_utils) for a quick way to set them up

```bash
# runs all tests
pnpm test

# runs all tests and output code coverage
pnpm test:coverage

# runs unit tests
pnpm test:unit

# runs unit tests that relies on a browser
# environment such as localstorage and the DOM
pnpm test:unit-browser

# runs integrations tests
pnpm test:integration

# runs e2e tests using playwright
pnpm test:e2e
```

## Building and deployment

The application is built using vite, it creates the `build` folder, however the actual application entrypoint
is the `app` folder, which starts up the HTTP server and uses the routes on the `build` folder.

Deployment for the homolog enviroment is done using github actions, basically what it does is run build the application
using docker, creating a new `rastercar/monolith` image, tagging it with the current git commit SHA, then it uploads
the new image to AWS ECR and finally updates the ECS task definition that runs the monolith to use the new image,
to verify the SHA of the git commit that the build application is running you can use the following.

```bash
curl -f http://rastercar.com/healthcheck\?debug\=true
```

## Database

```bash
# creating a database migration (first modify the schema and then call this command)

# migrations are applied on the app startup sequence
DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<db_name> pnpm drizzle-kit generate --name=<migration_name>
```