# Build stage
FROM node:20-alpine AS builder

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

# Install curl for the health check
RUN apk update && apk add --no-cache curl

# Remove the default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built application from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD [ "curl", "-f", "http://127.0.0.1:80/health" ]