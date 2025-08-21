# eKYC Testing Suite - Podman Container
# Optimized for Webpack-based testing and Go backend testing

FROM docker.io/library/node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    bash \
    make \
    g++ \
    python3 \
    go \
    && rm -rf /var/cache/apk/*

# Set Go environment
ENV GO_VERSION=1.21
ENV GOPATH=/go
ENV PATH=$GOPATH/bin:/usr/local/go/bin:$PATH

# Create app directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Install additional tools for testing
RUN npm install -g \
    webpack-cli \
    webpack-dev-server \
    @babel/cli \
    eslint

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p /app/dist \
    /app/test-reports \
    /app/coverage

# Build webpack bundles for testing
RUN npm run test:webpack || true

# Set proper permissions
RUN chmod +x *.js

# Expose ports for testing
EXPOSE 3001 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Default command
CMD ["npm", "test"]

# =============================================================================
# Multi-stage build for production testing
FROM base AS testing

# Copy test configurations
COPY webpack.test.config.js ./
COPY test-template.html ./
COPY ekyc-test-config.json ./

# Install development dependencies for testing
RUN npm install --only=development

# Run linting and validation
RUN npm run lint || true

# Create test user for security
RUN addgroup -g 1001 -S testuser && \
    adduser -S testuser -u 1001 -G testuser

# Change ownership of app directory
RUN chown -R testuser:testuser /app

# Switch to test user
USER testuser

# Set environment variables
ENV NODE_ENV=test
ENV WEBPACK_MODE=development
ENV TEST_TIMEOUT=30000

# Labels for Podman/Docker metadata
LABEL maintainer="eKYC Platform Team"
LABEL description="eKYC Testing Suite with Webpack and Go support"
LABEL version="1.0.0"
LABEL org.opencontainers.image.title="eKYC Testing Suite"
LABEL org.opencontainers.image.description="Comprehensive testing for eKYC platform"
LABEL org.opencontainers.image.vendor="eKYC Platform Team"
LABEL org.opencontainers.image.version="1.0.0"

# =============================================================================
# Development stage for interactive testing
FROM testing AS development

# Install additional development tools
USER root
RUN npm install -g \
    nodemon \
    webpack-bundle-analyzer \
    serve

# Switch back to test user
USER testuser

# Development command with hot reloading
CMD ["npm", "run", "test:watch"]

# =============================================================================
# Production testing stage
FROM testing AS production

# Environment variables for production testing
ENV NODE_ENV=production
ENV WEBPACK_MODE=production

# Run production build
RUN npm run test:webpack

# Final command for production testing
CMD ["npm", "run", "test:ci"]