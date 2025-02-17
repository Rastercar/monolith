# --------- setup the application
FROM node:lts-alpine AS base

# get the git commit hash (append with VITE_ to make sure its exposed to the vite build)
ARG VITE_COMMIT_HASH
ENV VITE_COMMIT_HASH=$VITE_COMMIT_HASH

# enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g corepack@latest
RUN corepack enable

# copy everything (that is not on .dockerignore) to the app directory
COPY . /app

WORKDIR /app

# --------- install prod dependencies in a way docker can cache it
FROM base AS prod-deps

# pass the args from the previous step
ARG VITE_COMMIT_HASH
ENV VITE_COMMIT_HASH=$VITE_COMMIT_HASH

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# --------- check types and build the application
FROM base AS build

# run svelte check to make sure the app has valid types
RUN pnpm run check

# get the vite commit hash env var so its used with pnpm run build
ARG VITE_COMMIT_HASH
ENV VITE_COMMIT_HASH=$VITE_COMMIT_HASH

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# --------- run the application
FROM base

# add curl so the healthcheck can succeed
RUN apk --no-cache add curl

# copy the dependencies
COPY --from=prod-deps /app/node_modules /app/node_modules

# copy the production build
COPY --from=build /app/build /app/build

# copy the app entrypoint (index.js)
COPY --from=build /app/app /app/app

EXPOSE 3000

CMD ["node", "app"]