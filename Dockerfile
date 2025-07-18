# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Debug: List contents to verify build output
RUN ls -la /app && echo "Build directory contents:" && ls -la /app/build || echo "Build directory not found"

# Production stage
FROM nginx:alpine AS production

# Remove the default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy your custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built application from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# The base nginx:alpine image's entrypoint will handle permissions
# and starting the server correctly. No need for USER, chown, or mkdir.

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1 