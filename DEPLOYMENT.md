# Deployment Guide 🚀

This guide covers various deployment options for ResumeScore in production environments.

## Table of Contents
- [Vercel + Render (Recommended)](#vercel--render-recommended)
- [Netlify + Railway](#netlify--railway)
- [Docker Deployment](#docker-deployment)
- [Manual VPS Deployment](#manual-vps-deployment)
- [Environment Variables](#environment-variables)
- [Monitoring & Health Checks](#monitoring--health-checks)

## Vercel + Render (Recommended)

### Frontend Deployment (Vercel)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` directory as the root

2. **Configure Build Settings**
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be available at `https://your-app.vercel.app`

### Backend Deployment (Render)

1. **Create New Web Service**
   - Go to [Render Dashboard](https://render.com/dashboard)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` directory

2. **Configure Service**
   ```
   Name: resumescore-api
   Environment: Python 3
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   ```

3. **Build & Start Commands**
   ```bash
   Build Command: pip install -r requirements.txt && python -m spacy download en_core_web_sm
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

4. **Environment Variables**
   ```
   PORT=10000 (auto-set by Render)
   PYTHON_VERSION=3.11.0
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Monitor build logs
   - Service will be available at `https://your-service.onrender.com`

## Netlify + Railway

### Frontend Deployment (Netlify)

1. **Connect Repository**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub and select repository

2. **Build Settings**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/.next
   ```

3. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
   ```

### Backend Deployment (Railway)

1. **Deploy from GitHub**
   - Go to [Railway](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Service**
   - Railway will auto-detect Python
   - Set root directory to `backend`

3. **Environment Variables**
   ```
   PORT=$PORT (Railway sets this automatically)
   ```

4. **Custom Start Command** (if needed)
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

## Docker Deployment

### Using Docker Compose (Development)

```bash
# Clone the repository
git clone <your-repo-url>
cd resume-score

# Build and run with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

### Production Docker Deployment

1. **Build Images**
   ```bash
   # Build backend image
   docker build -t resumescore-backend ./backend
   
   # Build frontend image
   docker build -t resumescore-frontend ./frontend
   ```

2. **Run Containers**
   ```bash
   # Run backend
   docker run -d \
     --name resumescore-api \
     -p 8000:8000 \
     -e PORT=8000 \
     resumescore-backend

   # Run frontend
   docker run -d \
     --name resumescore-web \
     -p 3000:3000 \
     -e NEXT_PUBLIC_API_URL=http://your-backend-url:8000 \
     resumescore-frontend
   ```

3. **With Docker Compose (Production)**
   ```yaml
   version: '3.8'
   services:
     backend:
       build: ./backend
       ports:
         - "8000:8000"
       environment:
         - PORT=8000
         - HOST=0.0.0.0
       restart: unless-stopped

     frontend:
       build: ./frontend
       ports:
         - "3000:3000"
       environment:
         - NEXT_PUBLIC_API_URL=http://backend:8000
       depends_on:
         - backend
       restart: unless-stopped
   ```

## Manual VPS Deployment

### Prerequisites
- Ubuntu 20.04+ or similar Linux distribution
- Domain name (optional)
- SSL certificate (Let's Encrypt recommended)

### Backend Setup

1. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip python3-venv nginx
   ```

2. **Setup Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd resume-score/backend
   
   # Create virtual environment
   python3 -m venv venv
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```

3. **Create Systemd Service**
   ```bash
   sudo nano /etc/systemd/system/resumescore.service
   ```
   
   ```ini
   [Unit]
   Description=ResumeScore API
   After=network.target

   [Service]
   User=www-data
   Group=www-data
   WorkingDirectory=/path/to/resume-score/backend
   Environment="PATH=/path/to/resume-score/backend/venv/bin"
   ExecStart=/path/to/resume-score/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

4. **Start Service**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start resumescore
   sudo systemctl enable resumescore
   ```

### Frontend Setup

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Build Application**
   ```bash
   cd ../frontend
   npm install
   npm run build
   ```

3. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/resumescore
   ```
   
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       # Frontend
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # Backend API
       location /api {
           proxy_pass http://localhost:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/resumescore /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Environment Variables

### Frontend Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.resumescore.com` |

### Backend Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `8000` |
| `HOST` | Server host | `0.0.0.0` |

## Monitoring & Health Checks

### Health Check Endpoints

- **Backend**: `GET /health`
- **Frontend**: Built-in Next.js health checks

### Monitoring Setup

1. **Uptime Monitoring**
   - Use services like UptimeRobot, Pingdom, or StatusCake
   - Monitor both frontend and backend health endpoints

2. **Performance Monitoring**
   - Vercel Analytics (for Vercel deployments)
   - Google Analytics
   - Sentry for error tracking

3. **Log Monitoring**
   - Render/Railway provide built-in logs
   - For VPS: Use centralized logging (ELK stack, Grafana)

### Example Health Check Script

```bash
#!/bin/bash
# health-check.sh

BACKEND_URL="https://your-api.com/health"
FRONTEND_URL="https://your-app.com"

# Check backend
if curl -f $BACKEND_URL > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is down"
fi

# Check frontend
if curl -f $FRONTEND_URL > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend is down"
fi
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `NEXT_PUBLIC_API_URL` is correctly set
   - Check backend CORS configuration

2. **Build Failures**
   - Verify Node.js/Python versions
   - Check for missing dependencies

3. **Performance Issues**
   - Enable caching headers
   - Use CDN for static assets
   - Monitor resource usage

4. **SSL Certificate Issues**
   - Ensure domain DNS is properly configured
   - Check certificate renewal

### Debug Commands

```bash
# Check service status
sudo systemctl status resumescore

# View logs
sudo journalctl -u resumescore -f

# Test backend directly
curl https://your-api.com/health

# Check Nginx configuration
sudo nginx -t
```

## Scaling Considerations

### Performance Optimization

1. **Frontend**
   - Enable Next.js static generation where possible
   - Use CDN for asset delivery
   - Implement proper caching strategies

2. **Backend**
   - Use connection pooling for database connections
   - Implement rate limiting
   - Consider horizontal scaling with load balancer

### Database Integration

For production use, consider adding:
- PostgreSQL for user data and analytics
- Redis for caching and session management
- MongoDB for document storage

---

**Need help with deployment? Check our [Support Guide](./SUPPORT.md) or open an issue on GitHub.**