# 📋 Environment Variables Reference

## Frontend Environment Variables

### `.env.production`
```dotenv
VITE_API_URL=https://housing-society-management-gcxn.onrender.com/api
```

### `.env.vercel`
```dotenv
VITE_API_URL=https://housing-society-management-gcxn.onrender.com/api
```

### `.env.render`
```dotenv
VITE_API_URL=https://housing-society-management-gcxn.onrender.com/api
```

### Local Development (`.env.development`)
```dotenv
VITE_API_URL=http://localhost:5000/api
```

---

## Backend Environment Variables

### `.env.production`
```dotenv
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://design_housing_management:design%4012345@cluster0.mxa36rk.mongodb.net/housing_society_hub?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=housing_society_hub_super_secret_jwt_key_2026_bhumi_project_64chars
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=https://www.housingsociety.online,https://housingsocietymanagement.vercel.app,https://housing-society-management-gcxn.onrender.com
```

### `.env.vercel`
```dotenv
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://design_housing_management:design%4012345@cluster0.mxa36rk.mongodb.net/housing_society_hub?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=housing_society_hub_super_secret_jwt_key_2026_bhumi_project_64chars
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=https://housingsocietymanagement.vercel.app,https://www.housingsociety.online,https://housing-society-management-gcxn.onrender.com
```

### `.env.render`
```dotenv
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://design_housing_management:design%4012345@cluster0.mxa36rk.mongodb.net/housing_society_hub?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=housing_society_hub_super_secret_jwt_key_2026_bhumi_project_64chars
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=https://housing-society-management-gcxn.onrender.com,https://www.housingsociety.online,https://housingsocietymanagement.vercel.app
```

### Local Development (`.env.development`)
```dotenv
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://design_housing_management:design%4012345@cluster0.mxa36rk.mongodb.net/housing_society_hub?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=housing_society_hub_super_secret_jwt_key_2026_bhumi_project_64chars
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173,http://localhost:3000,http://localhost:3001
```

---

## Setting Environment Variables on Platforms

### Render Dashboard
1. Go to your service
2. Click "Environment"
3. Click "Add Environment Variable"
4. Enter key and value
5. Click "Save"

### Vercel Dashboard (for backend on Vercel)
1. Go to Project Settings
2. Click "Environment Variables"
3. Select environment (Production, Preview, Development)
4. Add key and value
5. Click "Save"

---

## Security Notes

⚠️ **NEVER** commit `.env` files to git
- They contain sensitive credentials
- They're already in `.gitignore`
- Always set via platform dashboard

### MongoDB URI Format
- Replace `%40` with `@` if special characters in password
- Don't quote the entire URI
- Ensure `retryWrites=true` for reliability

### JWT Secret
- Use strong, random string
- At least 32 characters recommended
- Different for each environment
- Never expose in frontend

---

## Troubleshooting Environment Variables

### Frontend can't reach API
- Check `VITE_API_URL` matches backend domain
- Ensure protocol is https (not http) for production
- Check for trailing slashes

### Backend CORS errors
- Verify `CLIENT_ORIGIN` includes frontend URL
- Use exact URL from browser address bar
- Include both http and https if applicable
- No trailing slashes

### MongoDB connection fails
- Verify `MONGO_URI` is correct
- Check IP whitelist in MongoDB Atlas
- Test connection string locally
- Ensure special characters are URL-encoded

### JWT errors
- Verify `JWT_SECRET` is identical everywhere
- Check `JWT_EXPIRES_IN` format (e.g., "7d")
- Ensure token generation uses same secret
