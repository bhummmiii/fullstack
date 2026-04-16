# 🚀 Quick Deployment Guide

## Summary
Your Housing Society Hub is ready for production deployment on:
- **Frontend**: Vercel (https://housingsocietymanagement.vercel.app)
- **Backend**: Render (https://housing-society-management-gcxn.onrender.com)
- **Custom Domain**: www.housingsociety.online

## 5-Minute Setup

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 2. Deploy Backend on Render

**Visit**: https://render.com/dashboard

1. Click "New +" → "Web Service"
2. Select your GitHub repository
3. Fill in:
   - Name: `housing-society-backend`
   - Runtime: `Node`
   - Build: `npm install`
   - Start: `npm start`
4. Add Environment Variables (copy from `server/.env.render`):
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb+srv://design_housing_management:design%4012345@cluster0.mxa36rk.mongodb.net/housing_society_hub?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=housing_society_hub_super_secret_jwt_key_2026_bhumi_project_64chars
   JWT_EXPIRES_IN=7d
   CLIENT_ORIGIN=https://housing-society-management-gcxn.onrender.com,https://www.housingsociety.online,https://housingsocietymanagement.vercel.app
   ```
5. Click "Create Web Service"
6. Wait for deployment (2-5 minutes)
7. Note the URL: `https://housing-society-management-gcxn.onrender.com`

### 3. Deploy Frontend on Vercel

**Visit**: https://vercel.com/dashboard

1. Click "New Project"
2. Select your GitHub repository
3. Framework: `Vite`
4. Build Command: `cd client && npm install && npm run build`
5. Output Directory: `client/build`
6. Add Environment Variable:
   ```
   VITE_API_URL=https://housing-society-management-gcxn.onrender.com/api
   ```
7. Click "Deploy"
8. Wait for deployment (1-2 minutes)
9. Note the URL: `https://housingsocietymanagement.vercel.app`

### 4. Test Deployment
```bash
# Backend health check
curl https://housing-society-management-gcxn.onrender.com/api/health

# Should return:
# {
#   "success": true,
#   "message": "Housing Society Hub API is running",
#   "environment": "production",
#   "timestamp": "2026-04-16T12:00:00.000Z"
# }
```

### 5. Setup Custom Domain (Optional)

**For Frontend (Vercel)**:
1. Go to Vercel Dashboard → Project Settings → Domains
2. Add `www.housingsociety.online`
3. Add DNS CNAME record:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

## File Reference

| File | Purpose |
|------|---------|
| `server/.env.render` | Backend environment vars for Render |
| `server/.env.vercel` | Backend environment vars for Vercel |
| `client/.env.production` | Frontend production variables |
| `render.yaml` | Render deployment config |
| `vercel.json` | Vercel deployment config |
| `DEPLOYMENT.md` | Complete deployment guide |
| `RENDER_SETUP.md` | Detailed Render setup |
| `VERCEL_SETUP.md` | Detailed Vercel setup |
| `ENV_REFERENCE.md` | Environment variable reference |

## Environment Variables

### Backend URLs
- **Render**: https://housing-society-management-gcxn.onrender.com
- **Vercel**: https://housing-society-management-gcxn.onrender.com (same backend)

### Frontend URLs
- **Vercel**: https://housingsocietymanagement.vercel.app
- **Custom Domain**: https://www.housingsociety.online

## Common Issues

### 404 Errors
```
Solution: Check CLIENT_ORIGIN in server .env includes frontend URL
```

### Cannot reach database
```
Solution: Verify MONGO_URI is correct in server .env
```

### Frontend can't reach API
```
Solution: Ensure VITE_API_URL matches backend URL and uses https
```

### Cold start delays on Render
```
Note: Free tier spins down after 15 mins (normal)
Upgrade to Starter Plan ($7/month) for always-on service
```

## Monitoring

### Render Dashboard
- View logs: Click service → Logs tab
- Check status: Service status page
- Monitor usage: Metrics tab

### Vercel Dashboard
- View logs: Deployments tab
- Monitor performance: Analytics tab
- Check errors: Logs tab

## Next Steps

1. ✅ Push to GitHub
2. ✅ Deploy backend on Render
3. ✅ Deploy frontend on Vercel
4. ⏳ Test all endpoints
5. ⏳ Setup custom domain
6. ⏳ Configure monitoring
7. ⏳ Setup CI/CD (optional)

---

## Support Docs

- **Full Deployment Guide**: See `DEPLOYMENT.md`
- **Render Setup**: See `RENDER_SETUP.md`
- **Vercel Setup**: See `VERCEL_SETUP.md`
- **Environment Variables**: See `ENV_REFERENCE.md`

---

**Status**: ✅ Ready for Production Deployment
**Last Updated**: April 16, 2026
