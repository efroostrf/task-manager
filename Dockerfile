# Build stage
FROM node:18-alpine AS builder

LABEL maintainer="Yefrosynii Kolenko <contact@yefro.dev>"
LABEL org.opencontainers.image.authors="Yefrosynii Kolenko <contact@yefro.dev>"
LABEL org.opencontainers.image.url="https://www.yefro.dev"
LABEL org.opencontainers.image.source="https://github.com/efroostrf/task-manager"
LABEL org.opencontainers.image.license="MIT"
LABEL org.opencontainers.image.title="Task Manager"
LABEL org.opencontainers.image.description="Simple and efficient task management application"

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.9.0 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets from builder
COPY --from=builder /app/out ./out

# Set proper permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npx", "serve", "out"]
