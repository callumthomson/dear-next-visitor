# Build stage
FROM oven/bun:1 AS builder

ARG POSTHOG_KEY

ENV NEXT_PUBLIC_POSTHOG_KEY=$POSTHOG_KEY

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN mkdir -p public

RUN bun run build

FROM oven/bun:1-slim AS runner

ARG POSTHOG_KEY

WORKDIR /app

ENV NEXT_PUBLIC_POSTHOG_KEY=$POSTHOG_KEY
ENV NODE_ENV=production

# Copy necessary files from builder stage
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port the app will run on
EXPOSE 3000

# Command to run the application
CMD ["bun", "run", "start"]
