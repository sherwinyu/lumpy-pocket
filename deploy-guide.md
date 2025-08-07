# Deployment Guide for Lumpy Pocket

This guide covers multiple deployment options for your Lumpy Pocket app.

## 🐳 Docker Deployment (Recommended for VPS)

### Local Docker
```bash
# Build and run with Docker Compose
docker-compose up -d

# Access at http://localhost
```

### Deploy to VPS
1. SSH into your VPS
2. Install Docker and Docker Compose
3. Clone your repository
4. Run `docker-compose up -d`

## 🚀 Platform-Specific Deployments

### 1. Render.com (Free tier available)
```bash
# Connect your GitHub repo to Render
# Render will auto-detect render.yaml
# Or use the dashboard to create services manually
```

### 2. Fly.io (Good for global edge deployment)
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login and launch
fly auth login
fly launch
fly deploy
```

### 3. Railway (Simple deployment)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
```

### 4. Vercel (Frontend only recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### 5. Heroku Alternative - Render/Railway
Since Heroku removed free tier, use Render or Railway instead.

## 🔧 Environment Variables

Set these for production:
```
NODE_ENV=production
PORT=4001 (backend)
DATABASE_PATH=/data/lumpy.db (for persistent storage)
```

## 📦 Quick Deploy Scripts

### Deploy to Ubuntu VPS
```bash
#!/bin/bash
# Save as deploy.sh

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Clone and deploy
git clone [your-repo-url] lumpy-pocket
cd lumpy-pocket
sudo docker-compose up -d
```

### Deploy to Fly.io
```bash
# One-command deploy
fly launch --now
```

## 🔒 Production Considerations

1. **SSL/HTTPS**: Use Cloudflare or Let's Encrypt
2. **Backup**: Regular SQLite database backups
3. **Monitoring**: Add uptime monitoring (UptimeRobot, etc.)
4. **Domain**: Point your domain to the deployment

## 💡 Recommended Deployment

For simplicity and cost-effectiveness:
1. **Small scale**: Fly.io (generous free tier)
2. **Medium scale**: VPS with Docker
3. **Large scale**: AWS/GCP with managed database

## 🚨 Important Notes

- SQLite database is stored in `./lumpy.db` (backend) or `/app/data` (Docker)
- Make sure to persist the database volume in production
- The frontend is a static SPA that can be served from CDN
- Backend API needs to be accessible from frontend domain