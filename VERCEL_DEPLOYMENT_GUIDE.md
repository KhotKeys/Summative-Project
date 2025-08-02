# 🚀 Vercel Deployment Guide

## 📋 Prerequisites for Vercel Deployment

- GitHub repository with your code
- Vercel account (free tier available)
- Cloud database (PlanetScale, AWS RDS, or similar)
- Cloud Redis instance (Upstash, Redis Cloud)

---

## ⚡ Quick Deploy to Vercel

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables**
   In Vercel dashboard → Project Settings → Environment Variables:
   ```env
   DB_HOST=your-cloud-db-host
   DB_USER=your-db-user
   DB_PASS=your-db-password
   DB_NAME=Summative_API
   DB_PORT=3306
   REDIS_URL=redis://your-cloud-redis-url
   JWT_SECRET=your-production-jwt-secret
   NODE_ENV=production
   NODEMAILER_HOST=smtp.gmail.com
   NODEMAILER_EMAIL=your-email@gmail.com
   NODEMAILER_PASS=your-app-password
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Production Deploy**
   ```bash
   vercel --prod
   ```

---

## 🗄️ Database Setup for Production

### Option 1: PlanetScale (Recommended)

1. **Create PlanetScale Account**
   - Go to [planetscale.com](https://planetscale.com)
   - Create free account
   - Create new database

2. **Get Connection String**
   ```env
   DB_HOST=aws.connect.psdb.cloud
   DB_USER=your-username
   DB_PASS=your-password
   DB_NAME=your-database-name
   DB_PORT=3306
   ```

3. **Run Migrations**
   ```bash
   # Update your .env with PlanetScale credentials
   npx sequelize-cli db:migrate
   ```

### Option 2: AWS RDS MySQL

1. **Create RDS Instance**
   - Go to AWS Console → RDS
   - Create MySQL 8.x instance
   - Configure security groups

2. **Update Environment Variables**
   ```env
   DB_HOST=your-rds-endpoint.amazonaws.com
   DB_USER=admin
   DB_PASS=your-secure-password
   DB_NAME=Summative_API
   DB_PORT=3306
   ```

---

## 🔴 Redis Setup for Production

### Option 1: Upstash (Recommended)

1. **Create Upstash Account**
   - Go to [upstash.com](https://upstash.com)
   - Create Redis database

2. **Get Redis URL**
   ```env
   REDIS_URL=rediss://default:your-password@your-endpoint.upstash.io:6379
   ```

### Option 2: Redis Cloud

1. **Create Redis Cloud Account**
   - Go to [redis.com](https://redis.com)
   - Create free tier database

2. **Configure Connection**
   ```env
   REDIS_URL=redis://default:password@endpoint:port
   ```

---

## 🔧 Vercel Configuration Files

### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "server.js": {
      "maxDuration": 30
    }
  }
}
```

### Update `package.json` Scripts
```json
{
  "scripts": {
    "build": "echo 'No build step required'",
    "start": "node server.js",
    "dev": "nodemon server.js",
    "vercel-build": "echo 'Ready for Vercel'"
  }
}
```

---

## 🚨 Important Production Changes

### 1. Update CORS Configuration
```javascript
// app.js
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : 'http://localhost:3000',
  credentials: true
}));
```

### 2. Secure Environment Variables
- Never commit `.env` files
- Use strong JWT secrets in production
- Use secure database passwords
- Enable SSL for database connections

### 3. Update Database Connection for Production
```javascript
// config/db.js
const config = {
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
};
```

---

## 🧪 Testing Production Deployment

### 1. Health Check
```bash
curl https://your-app.vercel.app/
```

### 2. API Test
```bash
curl -X POST https://your-app.vercel.app/api/auth/system-admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@alu.edu","password":"AdminPass123"}'
```

### 3. Database Connection Test
Check Vercel logs for database connection success messages.

---

## 📊 Monitoring & Maintenance

### 1. Vercel Analytics
- Enable analytics in Vercel dashboard
- Monitor performance and usage

### 2. Error Logging
Consider adding services like:
- Sentry for error tracking
- LogRocket for session replay
- DataDog for monitoring

### 3. Database Monitoring
- Monitor connection counts
- Set up alerts for high usage
- Regular backup schedules

---

## 🔄 Continuous Deployment

Once connected to GitHub:
1. **Push to main branch** → Automatically deploys to production
2. **Push to feature branches** → Creates preview deployments
3. **Pull requests** → Generate preview URLs for testing

---

## 🎯 Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] Redis connection working
- [ ] API endpoints responding correctly
- [ ] Email notifications working
- [ ] SSL certificates active
- [ ] CORS configured properly
- [ ] Error tracking enabled
- [ ] Monitoring dashboard set up
- [ ] Backup strategy in place

---

## 🆘 Troubleshooting

### Common Issues:

1. **Database Connection Fails**
   - Check environment variables
   - Verify database host/port
   - Ensure SSL configuration is correct

2. **Redis Connection Issues**
   - Verify Redis URL format
   - Check Upstash/Redis Cloud credentials
   - Confirm SSL requirements

3. **Function Timeout**
   - Increase `maxDuration` in vercel.json
   - Optimize database queries
   - Add caching where possible

4. **CORS Errors**
   - Update allowed origins
   - Check preflight requests
   - Verify headers configuration

---

## 📞 Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **PlanetScale Docs**: [planetscale.com/docs](https://planetscale.com/docs)
- **Upstash Docs**: [docs.upstash.com](https://docs.upstash.com)

Your API is now ready for production deployment on Vercel! 🚀
