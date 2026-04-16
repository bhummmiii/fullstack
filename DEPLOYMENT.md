# 🚀 Production Deployment Guide

## Deployment URLs

- **Frontend (Vercel)**: https://housingsocietymanagement.vercel.app
- **Backend (Render)**: https://housing-society-management-gcxn.onrender.com
- **Custom Domain**: https://www.housingsociety.online

---

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB Atlas account with connection string
- Vercel account (for frontend)
- Render account (for backend)
- Git repository

---

## 🔧 Environment Variables

### Server Environment Variables

#### For Render Deployment (`.env.render`)
```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://design_housing_management:design%4012345@cluster0.mxa36rk.mongodb.net/housing_society_hub?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=housing_society_hub_super_secret_jwt_key_2026_bhumi_project_64chars
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=https://housing-society-management-gcxn.onrender.com,https://www.housingsociety.online,https://housingsocietymanagement.vercel.app
```

#### For Vercel Deployment (`.env.vercel`)
```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://design_housing_management:design%4012345@cluster0.mxa36rk.mongodb.net/housing_society_hub?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=housing_society_hub_super_secret_jwt_key_2026_bhumi_project_64chars
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=https://housingsocietymanagement.vercel.app,https://www.housingsociety.online,https://housing-society-management-gcxn.onrender.com
```

### Client Environment Variables

#### For Production (`.env.production`)
```
VITE_API_URL=https://housing-society-management-gcxn.onrender.com/api
```

#### For Vercel (`.env.vercel`)
```
VITE_API_URL=https://housing-society-management-gcxn.onrender.com/api
```

#### For Render (`.env.render`)
```
VITE_API_URL=https://housing-society-management-gcxn.onrender.com/api
```

---

## 🌐 Render Backend Deployment

### Step 1: Connect Repository
1. Go to https://dashboard.render.com
2. Click "New +" → Select "Web Service"
3. Connect your GitHub repository
4. Select the branch to deploy (usually `main`)

### Step 2: Configure Build Settings
```
Name: housing-society-backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### Step 3: Set Environment Variables
In Render dashboard, add these variables:
```
NODE_ENV = production
PORT = 5000
MONGO_URI = [Your MongoDB Atlas connection string]
JWT_SECRET = [Your JWT secret]
JWT_EXPIRES_IN = 7d
CLIENT_ORIGIN = https://housing-society-management-gcxn.onrender.com,https://www.housingsociety.online,https://housingsocietymanagement.vercel.app
```

### Step 4: Deploy
- Click "Create Web Service"
- Render will automatically deploy on every push to main branch

**Backend URL**: https://housing-society-management-gcxn.onrender.com

---

## 🎨 Vercel Frontend Deployment

### Step 1: Connect Repository
1. Go to https://vercel.com
2. Click "New Project"
3. Import your Git repository
4. Select root directory settings

### Step 2: Configure Build Settings
```
Framework: Vite
Build Command: npm run build
Output Directory: client/build
Install Command: cd client && npm install
```

### Step 3: Set Environment Variables
```
VITE_API_URL = https://housing-society-management-gcxn.onrender.com/api
```

### Step 4: Deploy
- Click "Deploy"
- Vercel will automatically deploy on every push to main branch

**Frontend URL**: https://housingsocietymanagement.vercel.app

---

## 🌍 Custom Domain Setup (www.housingsociety.online)

### For Frontend (Vercel):
1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your domain: `housingsociety.online`
3. Update DNS records according to Vercel's instructions
4. Add subdomain: `www.housingsociety.online`

### DNS Records to Configure:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

---

## 🔐 Security Checklist

- [ ] MongoDB password contains no special characters (or properly URL-encoded)
- [ ] JWT_SECRET is strong and kept secret
- [ ] CORS origins only include production URLs
- [ ] Environment files (.env.local, .env.development) are in .gitignore
- [ ] No sensitive data in version control
- [ ] HTTPS is enforced for all domains
- [ ] MongoDB IP whitelist includes Render/Vercel IPs

---

## 📊 Build & Deploy Process

### Local Build Testing
```bash
# Build server-side assets
npm run build

# Build client
cd client
npm run build

# Test production build locally
NODE_ENV=production PORT=5000 npm start
```

### Automated Deployment
- Push to `main` branch triggers automatic deployment
- Render watches for changes automatically
- Vercel watches for changes automatically
- No manual intervention needed

---

## 🐛 Troubleshooting

### 404 Not Found Errors
- Ensure `CLIENT_ORIGIN` includes all frontend URLs in server `.env`
- Check CORS configuration in `server/server.js`

### API Connection Failures
- Verify `VITE_API_URL` matches backend URL
- Check firewall rules allow backend URL
- Ensure MongoDB connection string is correct

### Build Failures
- Check Node version compatibility (>=18.0.0)
- Verify all dependencies are installed
- Check for environment variable issues
- Review build logs on Render/Vercel dashboard

### Slow Deployment Startup
- Render free tier has cold start delays
- Consider upgrading to paid plan for faster deployments
- MongoDB connection pooling configured

---

## 📱 Health Checks

### Backend Health Endpoint
```
GET https://housing-society-management-gcxn.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Housing Society Hub API is running",
  "environment": "production",
  "timestamp": "2026-04-16T12:00:00.000Z"
}
```

---

## 🔄 Continuous Integration/Deployment

### GitHub Actions (Optional)
To add CI/CD pipeline, create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Render & Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
```

---

## 📞 Support

For deployment issues:
1. Check Render/Vercel dashboard logs
2. Review environment variables
3. Verify MongoDB connection
4. Check CORS configuration
5. Review GitHub repository settings

---

## ✅ Final Checklist

- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] CORS origins updated
- [ ] Build scripts working locally
- [ ] Vercel setup complete
- [ ] Render setup complete
- [ ] Custom domain configured
- [ ] Health endpoints responding
- [ ] Changes committed and pushed
- [ ] Deployments triggered and monitoring
