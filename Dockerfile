# Production Dockerfile for Cosecha Tropical Server
FROM node:20-alpine

# Create app user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]