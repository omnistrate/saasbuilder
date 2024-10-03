# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
FROM node:20.11.1-slim AS base

# Next.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"
ARG YARN_VERSION=1.22.21
RUN npm install -g yarn@$YARN_VERSION --force


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN --mount=type=cache,target=/var/cache/apt \
    apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 || \
    (echo "Package installation failed. Contents of /var/log/apt/term.log:" && \
     cat /var/log/apt/term.log && \
     exit 1)

# Install node modules
COPY --link package.json yarn.lock ./
RUN --mount=type=cache,target=/root/.cache/yarn \
    yarn install --frozen-lockfile --production=false --network-timeout 1000000

# Copy application code
COPY --link . .

# Build application
RUN --mount=type=cache,target=/root/.cache/yarn \
    yarn run build

# Remove development dependencies
RUN --mount=type=cache,target=/root/.cache/yarn \
    yarn install --production=true --network-timeout 1000000

# Final stage for app image
FROM base

ENV NODE_ENV="production"
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application from the previous stage
COPY --from=build /app /app

RUN chown -R nextjs:nodejs /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000

USER nextjs

CMD [ "node", "server.js" ]