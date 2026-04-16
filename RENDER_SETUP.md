# 🚀 Render Backend Deployment Setup Guide

## Overview
Render is ideal for Node.js backends. It provides free tier with automatic deployments.

## Quick Start

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare backend for production"
git push origin main
```

### Step 2: Create New Web Service on Render
1. Go to [render.com](https://render.com)
2. Click "New +" menu
3. Select "Web Service"
4. Click "Connect a repository"
5. Select your `fullstack` GitHub repository
6. Click "Connect"

### Step 3: Configure Service

**Name:** `housing-society-backend`
**Environment:** `Node`
**Build Command:** `npm install`
**Start Command:** `npm start`

### Step 4: Add Environment Variables

Click "Add Environment Variable" and add these:

```
NODE_ENV = production
PORT = 5000
MONGO_URI = mongodb+srv://design_housing_management:design%4012345@cluster0.mxa36rk.mongodb.net/housing_society_hub?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET = housing_society_hub_super_secret_jwt_key_2026_bhumi_project_64chars
JWT_EXPIRES_IN = 7d
CLIENT_ORIGIN = https://housing-society-management-gcxn.onrender.com,https://www.housingsociety.online,https://housingsocietymanagement.vercel.app
```

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Deployment takes 2-5 minutes
4. Check dashboard for status

**Your backend will be live at**: `https://housing-society-management-gcxn.onrender.com`

## Important Notes

### Render Free Tier
- Services spin down after 15 minutes of inactivity
- First request will take 30+ seconds (cold start)
- Sufficient for development/demo purposes
- Upgrade to Starter Plan ($7/month) for always-on service

### MongoDB on Render
If using Render's database:
1. Create new PostgreSQL database (not suitable for MongoDB)
2. Use external MongoDB Atlas instead (recommended)
3. Whitelist Render's IP in MongoDB Atlas

## Connecting Frontend

Update frontend environment variable:
```
VITE_API_URL = https://housing-society-management-gcxn.onrender.com/api
```

This URL should be set in Vercel's environment variables.

## Health Check

Test your backend:
```bash
curl https://housing-society-management-gcxn.onrender.com/api/health
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

## Troubleshooting

### Deployment fails
- Check build logs in Render dashboard
- Ensure package.json has `npm start` command
- Verify all environment variables are set
- Check Node version (>=18.0.0)

### 503 Service Unavailable
- Service may be initializing (cold start)
- Wait 30-60 seconds after first request
- Check MongoDB connection in logs

### CORS Errors
- Ensure frontend URL is in `CLIENT_ORIGIN`
- Both http and https variations needed
- No trailing slashes

### Cannot connect to MongoDB
- Verify connection string in MongoDB Atlas
- Check IP whitelist in MongoDB Atlas
- Test connection string locally first

## Monitoring Logs

View logs in Render dashboard:
1. Click your service
2. Click "Logs" tab
3. Real-time logs will appear
4. Search for errors

## Updates and Redeployment

1. Make changes locally
2. Commit and push to GitHub
3. Render automatically detects changes
4. Automatic redeployment starts
5. Check dashboard for status

To manually redeploy:
1. Go to Render dashboard
2. Click service → "Manual Deploy" → "Deploy Latest Commit"

## Custom Domain

If upgrading to paid plan and using custom domain:
1. Go to Settings → Custom Domain
2. Add `api.housingsociety.online`
3. Update DNS CNAME record
4. Update frontend's `VITE_API_URL`

## Database Backups

MongoDB Atlas automatically handles:
- Automated daily backups
- Point-in-time recovery
- Replica set snapshots

No additional configuration needed.
