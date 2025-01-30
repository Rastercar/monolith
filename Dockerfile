# --- setup the application
FROM node:23.3-alpine AS base

# enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# copy everything (that is not on .dockerignore) to the app directory
COPY . /app

WORKDIR /app

# --- install prod dependencies in a way docker can cache it
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# --- build the application
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# --- run the application
FROM base

# add curl so the healthcheck can succeed
RUN apk --no-cache add curl

# copy the dependencies
COPY --from=prod-deps /app/node_modules /app/node_modules

# copy the production build
COPY --from=build /app/build /app/build

# copy the app entrypoint (index.js)
COPY --from=build /app/server /app/server

# important, set the origin as this is needed to avoid cors errors
ENV ORIGIN=http://localhost:3000

EXPOSE 3000
CMD ["node", "server"]