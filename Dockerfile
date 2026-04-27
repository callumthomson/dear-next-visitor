FROM oven/bun:1 AS build

WORKDIR /app

COPY . .
RUN bun install --frozen-lockfile

# Declare build arguments
ARG POSTHOG_KEY
# Make it available as environment variable during build
ENV VITE_PUBLIC_POSTHOG_KEY=$POSTHOG_KEY

# Build the project
RUN bun run build

FROM oven/bun:1 AS production

WORKDIR /app

# Copy only what is needed for runtime
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.ts ./server.ts
COPY --from=build /app/node_modules ./node_modules

# Expose a port if needed
EXPOSE 3000

# Start the app
CMD ["bun", "server.ts"]
