# Docker Deployment Guide - Cosecha Tropical Server

This guide covers how to deploy the Cosecha Tropical Server using Docker for both development and production environments.

## 🐳 Prerequisites

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Environment Variables** configured

## 📁 Files Overview

- `Dockerfile` - Multi-stage Docker build configuration
- `docker-compose.yml` - Container orchestration
- `.dockerignore` - Files to exclude from Docker build
- `deploy.sh` - Deployment automation script
- `DEPLOYMENT.md` - This documentation

## 🔧 Environment Setup

### 1. Environment Variables

Create a `.env` file in the project root:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Server Configuration
PORT=3000
NODE_ENV=production
```

### 2. Make Deployment Script Executable

```bash
chmod +x deploy.sh
```

## 🚀 Quick Start

### Development Mode

```bash
# Start development container with hot reload
./deploy.sh dev

# Or using docker-compose directly
docker-compose --profile dev up --build
```

### Production Mode

```bash
# Start production container on port 3000
./deploy.sh prod

# Start production container on custom port
./deploy.sh prod-custom 8080

# Or using docker-compose directly
docker-compose --profile prod up --build -d
```

## 📋 Deployment Commands

### Using the Deployment Script

```bash
# Development
./deploy.sh dev

# Production (port 3000)
./deploy.sh prod

# Production (custom port)
./deploy.sh prod-custom 8080

# Build all images
./deploy.sh build

# View logs
./deploy.sh logs

# Stop containers
./deploy.sh stop

# Clean up resources
./deploy.sh clean

# Show help
./deploy.sh help
```

### Using Docker Compose Directly

```bash
# Development
docker-compose --profile dev up --build

# Production
docker-compose --profile prod up --build -d

# Production with custom port
PORT=8080 docker-compose --profile prod-custom up --build -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Using Docker Commands Directly

```bash
# Build production image
docker build --target production -t cosecha-tropical-server:prod .

# Run production container
docker run -d \
  --name cosecha-tropical-server \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e SUPABASE_URL=your_url \
  -e SUPABASE_ANON_KEY=your_key \
  cosecha-tropical-server:prod

# Build development image
docker build --target development -t cosecha-tropical-server:dev .

# Run development container
docker run -d \
  --name cosecha-tropical-server-dev \
  -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -e NODE_ENV=development \
  cosecha-tropical-server:dev
```

## 🏗️ Dockerfile Stages

### Base Stage
- Uses Node.js 20 Alpine for smaller image size
- Installs production dependencies
- Sets up working directory

### Development Stage
- Includes all dev dependencies
- Enables hot reload with `ts-node-dev`
- Mounts source code for live development

### Build Stage
- Compiles TypeScript to JavaScript
- Creates optimized production build
- Includes source maps for debugging

### Production Stage
- Minimal production image
- Non-root user for security
- Health checks for monitoring
- Only production dependencies

## 🔒 Security Features

- **Non-root user**: Application runs as `nodejs` user (UID 1001)
- **Minimal base image**: Alpine Linux for smaller attack surface
- **Production-only dependencies**: No dev tools in production image
- **Health checks**: Automatic container health monitoring

## 📊 Health Checks

The production container includes health checks:

```bash
# Check container health
docker ps

# View health check logs
docker inspect --format='{{json .State.Health}}' container_name
```

## 🔍 Monitoring & Logs

### View Container Logs

```bash
# All containers
docker-compose logs -f

# Specific service
docker-compose logs -f app-prod

# Using deployment script
./deploy.sh logs
```

### Container Status

```bash
# Running containers
docker ps

# All containers (including stopped)
docker ps -a

# Container resource usage
docker stats
```

## 🧹 Cleanup

### Remove Containers and Images

```bash
# Using deployment script
./deploy.sh clean

# Using docker-compose
docker-compose down --remove-orphans
docker system prune -f
```

### Manual Cleanup

```bash
# Stop and remove containers
docker stop $(docker ps -q --filter ancestor=cosecha-tropical-server)
docker rm $(docker ps -aq --filter ancestor=cosecha-tropical-server)

# Remove images
docker rmi cosecha-tropical-server:development
docker rmi cosecha-tropical-server:production

# Remove dangling images
docker image prune -f
```

## 🌐 Production Deployment

### Environment Variables

Ensure these are set in production:

```bash
NODE_ENV=production
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_supabase_key
PORT=3000
```

### Reverse Proxy (Nginx Example)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL/HTTPS

For production, always use HTTPS:

```bash
# Using Let's Encrypt with Certbot
sudo certbot --nginx -d your-domain.com
```

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Kill the process or use different port
   ./deploy.sh prod-custom 8080
   ```

2. **Permission denied**
   ```bash
   # Make script executable
   chmod +x deploy.sh
   ```

3. **Environment variables not loaded**
   ```bash
   # Check if .env file exists
   ls -la .env
   
   # Verify environment variables
   docker-compose config
   ```

4. **Build fails**
   ```bash
   # Clean and rebuild
   ./deploy.sh clean
   ./deploy.sh build
   ```

### Debug Commands

```bash
# Enter running container
docker exec -it container_name sh

# View container logs
docker logs container_name

# Check container health
docker inspect container_name

# View build history
docker history image_name
```

## 📈 Performance Optimization

### Image Size Optimization

- Multi-stage builds reduce final image size
- Alpine Linux base image (~5MB vs ~300MB for Ubuntu)
- Production-only dependencies
- Layer caching optimization

### Runtime Optimization

- Health checks for automatic recovery
- Non-root user for security
- Proper signal handling
- Memory and CPU limits (if needed)

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push Docker image
        run: |
          docker build --target production -t your-registry/cosecha-tropical-server:${{ github.sha }} .
          docker push your-registry/cosecha-tropical-server:${{ github.sha }}
      
      - name: Deploy to server
        run: |
          # Your deployment commands here
```

## 📞 Support

For deployment issues:

1. Check the troubleshooting section
2. Review container logs
3. Verify environment variables
4. Ensure Docker and Docker Compose are up to date

---

**Happy Deploying! 🚀** 