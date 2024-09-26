# syntax = docker/dockerfile:1

# Throw-away build stage to reduce size of final image
FROM node:20.11.1-slim AS build

# Next.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ARG YARN_VERSION=1.22.21
RUN npm install -g yarn@$YARN_VERSION --force

# Install packages needed to build node modules
RUN --mount=type=cache,target=/var/cache/apt \
    apt-get update -qq

RUN --mount=type=cache,target=/var/cache/apt \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY --link package.json ./
RUN --mount=type=cache,target=/root/.cache/yarn \
    yarn install --frozen-lockfile --production=true --network-timeout 1000000

# Copy application code
COPY --link . .

# Build application
RUN --mount=type=cache,target=/root/.cache/yarn \
    yarn run build

# Final stage for app image
FROM node:20.11.1-slim AS final

# Next.js app lives here
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built application from the previous stage
COPY --from=build /app /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

# Start the server by default, this can be overwritten at runtime
USER nextjs

EXPOSE 3000

CMD [ "node", "server.js" ]