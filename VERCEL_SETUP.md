# 🚀 Vercel Deployment Setup Guide

## Overview
Vercel is perfect for frontend deployments. It automatically detects your Vite configuration and builds accordingly.

## Quick Start

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Connect Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose `fullstack` repository
5. Click "Import"

### Step 3: Configure Project Settings

**General Settings:**
- Framework Preset: `Vite`
- Build Command: `cd client && npm install && npm run build`
- Output Directory: `client/build`
- Install Command: `npm install` or leave blank

**Root Directory:**
- Leave as default (project root)

### Step 4: Add Environment Variables

Click "Environment Variables" and add:

```
VITE_API_URL = https://housing-society-management-gcxn.onrender.com/api
```

### Step 5: Deploy

Click "Deploy" and wait for the build to complete.

**Your frontend will be live at**: `https://housingsocietymanagement.vercel.app`

## Advanced Configuration

### Using vercel.json
The `vercel.json` file in root directory is already configured:
- Builds client from `client/` directory
- Routes API requests to backend server
- Handles SPA routing (all routes go to index.html)

### Environment Variables for Different Branches
- `main` → Production environment
- Preview deployments for pull requests

### Custom Domain Setup

1. Go to Project Settings → Domains
2. Add your domain `housingsociety.online`
3. Follow DNS setup instructions
4. Add `www` subdomain

## Build Logs
Always check the Deployment tab in Vercel for build logs if something goes wrong.

## Performance Tips
- Client build is optimized with terser minification
- CSS is automatically minified
- Images in `public/` folder will be optimized
- Consider adding Image Optimization: `next/image` equivalent

## Rollback
If deployment fails:
1. Check build logs in Vercel Dashboard
2. Verify environment variables are set
3. Ensure `client/build` directory is in .vercelignore (it should be built fresh)

## Monitoring
- Vercel provides free analytics
- Monitor performance and errors
- Check real user monitoring (RUM) in Insights tab
