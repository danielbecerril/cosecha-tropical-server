# Fly.io Deployment Guide - Cosecha Tropical Server

This guide covers deploying your Cosecha Tropical Server to Fly.io, a modern platform for running full-stack apps and databases.

## 🚀 Quick Start

```bash
# 1. Install Fly CLI
curl -L https://fly.io/install.sh | sh

# 2. Login to Fly.io
fly auth login

# 3. Make deployment script executable
chmod +x deploy-fly.sh

# 4. Initial setup
./deploy-fly.sh setup

# 5. Deploy
./deploy-fly.sh deploy
```

## 📋 Prerequisites

- **Fly.io Account**: Sign up at [fly.io](https://fly.io)
- **Fly CLI**: Install the command-line tool
- **Supabase Project**: Your database and environment variables
- **Git Repository**: Your code should be in a Git repository

## 🔧 Installation

### 1. Install Fly CLI

**macOS/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

**Windows:**
```bash
# Using PowerShell
iwr https://fly.io/install.ps1 -useb | iex
```

**Manual Installation:**
```bash
# Download from GitHub releases
# https://github.com/superfly/flyctl/releases
```

### 2. Login to Fly.io

```bash
fly auth login
```

This will open your browser to authenticate with Fly.io.

## 🏗️ Configuration Files

### fly.toml

The main configuration file for your Fly.io app:

```toml
app = "cosecha-tropical-server"
primary_region = "mad"

[build]
  dockerfile = "Dockerfile"
  target = "production"

[env]
  NODE_ENV = "production"
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

  [[http_service.checks]]
    grace_period = "10s"
    interval = "30s"
    method = "GET"
    timeout = "5s"
    path = "/api/health"

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 512
```

### Key Configuration Options

- **`app`**: Your app name (must be unique globally)
- **`primary_region`**: Primary deployment region (e.g., "mad" for Madrid)
- **`internal_port`**: Port your app listens on (8080 for Fly.io)
- **`auto_stop_machines`**: Stop machines when not in use (cost optimization)
- **`min_machines_running`**: Minimum running instances (0 for auto-stop)

## 🔐 Environment Variables & Secrets

### Setting Secrets

```bash
# Set Supabase URL
fly secrets set SUPABASE_URL="your_supabase_url"

# Set Supabase Anon Key
fly secrets set SUPABASE_ANON_KEY="your_supabase_anon_key"

# Set custom port (optional)
fly secrets set PORT="8080"
```

### Viewing Secrets

```bash
# List all secrets
fly secrets list

# View specific secret
fly secrets list | grep SUPABASE_URL
```

### Removing Secrets

```bash
# Remove a secret
fly secrets unset SECRET_NAME
```

## 🚀 Deployment Commands

### Using the Deployment Script

```bash
# Initial setup (create app and set secrets)
./deploy-fly.sh setup

# Deploy the app
./deploy-fly.sh deploy

# View logs
./deploy-fly.sh logs

# Check status
./deploy-fly.sh status

# Scale the app
./deploy-fly.sh scale

# Destroy the app (permanent)
./deploy-fly.sh destroy
```

### Using Fly CLI Directly

```bash
# Create app
fly apps create cosecha-tropical-server

# Deploy
fly deploy

# View status
fly status

# View logs
fly logs

# Scale
fly scale count 2

# Destroy
fly apps destroy cosecha-tropical-server
```

## 🌍 Regions

### Available Regions

Fly.io has data centers worldwide. Choose the closest to your users:

```bash
# List available regions
fly platform regions

# Set primary region
fly apps create my-app --org personal --region mad
```

### Popular Regions

- **`mad`** - Madrid, Spain
- **`lhr`** - London, UK
- **`iad`** - Washington DC, USA
- **`syd`** - Sydney, Australia
- **`nrt`** - Tokyo, Japan

## 📊 Monitoring & Logs

### Viewing Logs

```bash
# Real-time logs
fly logs

# Follow logs
fly logs -f

# Logs for specific app
fly logs -a cosecha-tropical-server

# Logs with timestamps
fly logs -t
```

### Health Checks

Your app includes health checks at `/api/health`:

```bash
# Test health endpoint
curl https://cosecha-tropical-server.fly.dev/api/health

# Expected response
{
  "success": true,
  "message": "API is running successfully",
  "timestamp": "2025-07-18T20:00:00.000Z"
}
```

### Metrics

```bash
# View app metrics
fly status

# View machine details
fly machine list

# View app info
fly info
```

## 🔧 Scaling & Performance

### Scaling Options

```bash
# Scale to 2 instances
fly scale count 2

# Scale with specific VM size
fly scale vm shared-cpu-1x --memory 512

# Auto-scaling (based on load)
fly scale count 1-5
```

### VM Sizes

- **`shared-cpu-1x`**: 1 shared CPU, 256MB RAM
- **`shared-cpu-2x`**: 2 shared CPUs, 512MB RAM
- **`performance-1x`**: 1 dedicated CPU, 2GB RAM
- **`performance-2x`**: 2 dedicated CPUs, 4GB RAM

### Cost Optimization

```bash
# Enable auto-stop (stops when not in use)
fly scale count 0

# Set minimum running instances
fly scale count 1 --min-count 0
```

## 🔒 Security

### HTTPS/SSL

Fly.io automatically provides SSL certificates:

```bash
# Force HTTPS (enabled by default)
fly config set force_https true

# Custom domains
fly certs add your-domain.com
```

### Authentication

Your app uses password-based authentication:

```bash
# Test with authentication
curl -H "x-api-password: cosecha-tropical-2024" \
  https://cosecha-tropical-server.fly.dev/api/clients
```

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Deploy to Fly.io

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Fly CLI
        run: |
          curl -L https://fly.io/install.sh | sh
          echo "$HOME/.fly/bin" >> $GITHUB_PATH
      
      - name: Deploy to Fly.io
        run: |
          fly deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Setting up CI/CD

1. **Generate API Token:**
   ```bash
   fly tokens create deploy
   ```

2. **Add to GitHub Secrets:**
   - Go to your repository settings
   - Add `FLY_API_TOKEN` with the generated token

3. **Push to main branch** to trigger deployment

## 🛠️ Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Check build logs
   fly logs --build
   
   # Rebuild locally
   fly deploy --local-only
   ```

2. **App Won't Start**
   ```bash
   # Check app logs
   fly logs
   
   # Check health endpoint
   curl https://your-app.fly.dev/api/health
   ```

3. **Port Issues**
   ```bash
   # Verify port configuration
   fly config show
   
   # Check if port 8080 is exposed
   fly status
   ```

4. **Environment Variables**
   ```bash
   # List secrets
   fly secrets list
   
   # Set missing secrets
   fly secrets set SUPABASE_URL="your_url"
   ```

### Debug Commands

```bash
# SSH into running machine
fly ssh console

# View machine details
fly machine list

# Restart app
fly apps restart

# View app configuration
fly config show
```

## 📈 Performance Optimization

### Memory Optimization

```bash
# Monitor memory usage
fly status

# Scale up if needed
fly scale vm shared-cpu-2x --memory 1024
```

### Database Connection

Ensure your Supabase connection is optimized:

```typescript
// In your database config
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: false // For server-side usage
  }
});
```

## 💰 Cost Management

### Free Tier

- **3 shared-cpu-1x 256mb VMs**
- **3GB persistent volume storage**
- **160GB outbound data transfer**

### Cost Monitoring

```bash
# View usage
fly billing show

# Set spending limits
fly billing set-credit-card
```

### Cost Optimization Tips

1. **Use auto-stop** for development apps
2. **Scale down** when not in use
3. **Monitor usage** regularly
4. **Use shared CPUs** for non-critical apps

## 🔗 Custom Domains

### Adding Custom Domain

```bash
# Add custom domain
fly certs add your-domain.com

# Verify DNS settings
fly certs show your-domain.com
```

### DNS Configuration

Add these DNS records:

```
Type: A
Name: your-domain.com
Value: [Fly.io IP]
```

## 📞 Support

### Fly.io Support

- **Documentation**: [fly.io/docs](https://fly.io/docs)
- **Community**: [community.fly.io](https://community.fly.io)
- **Status**: [status.fly.io](https://status.fly.io)

### Useful Commands

```bash
# Get help
fly help

# View app info
fly info

# List all apps
fly apps list

# View recent deployments
fly releases list
```

---

## 🎉 Deployment Checklist

- [ ] Fly CLI installed and authenticated
- [ ] App created on Fly.io
- [ ] Secrets configured (Supabase URL and Key)
- [ ] Code committed to Git repository
- [ ] Health endpoint working (`/api/health`)
- [ ] Authentication working
- [ ] Custom domain configured (optional)
- [ ] Monitoring and alerts set up (optional)

**Your app is now ready for production on Fly.io! 🚀** 