# 🚀 Cloudflare D1 Quick Start Guide

**TL;DR** - Get your database live on Cloudflare in 5 minutes.

---

## **1️⃣ PREREQUISITES**
- Node.js 18+
- Free Cloudflare account
- Git

---

## **2️⃣ INSTALLATION (Choose One)**

### **Option A: Windows (Recommended)**
```batch
# Run the automated script
DEPLOY.bat

# Follow the prompts and copy your Database ID when shown
```

### **Option B: macOS/Linux**
```bash
# Run the automated script
chmod +x DEPLOY.sh
./DEPLOY.sh

# Follow the prompts
```

### **Option C: Manual Steps**
```bash
# 1. Install Wrangler
npm install --save-dev wrangler

# 2. Login to Cloudflare
wrangler login

# 3. Create database
wrangler d1 create envision_db
# ⚠️ Copy the Database ID

# 4. Update wrangler.toml with Database ID
# Edit wrangler.toml and replace YOUR_DATABASE_ID_HERE

# 5. Initialize schema
wrangler d1 execute envision_db --file=./backend/migrations/0001_schema.sql

# 6. Install dependencies
npm install
```

---

## **3️⃣ VERIFY SETUP**

```bash
# Check database tables
wrangler d1 execute envision_db --command "SELECT name FROM sqlite_master WHERE type='table';"

# Should show: teams, departments, events, core_team
```

---

## **4️⃣ TEST LOCALLY**

```bash
# Start dev server
npm run worker:dev

# In another terminal, test:
curl http://localhost:8787/api/events
curl http://localhost:8787/api/team
```

---

## **5️⃣ DEPLOY TO PRODUCTION**

```bash
# Deploy to Cloudflare
npm run worker:deploy

# Your API is now live! You'll see a URL like:
# https://envision-api.xxxxx.workers.dev/api/events
```

---

## **6️⃣ UPDATE FRONTEND**

In your React code, update API URLs:

```javascript
// Before (old Express backend)
const api = 'http://localhost:5000'

// After (Cloudflare Workers)
const api = 'https://envision-api.xxxxx.workers.dev'
```

---

## **📊 WHAT YOU GET**

✅ **Serverless API** - No servers to manage
✅ **Global Database** - Data replicated worldwide
✅ **Free Tier** - Generous free limits
✅ **Auto-scaling** - Handles traffic spikes
✅ **Ultra-fast** - Edge network delivery

---

## **🆘 TROUBLESHOOTING**

| Problem | Solution |
|---------|----------|
| "Database not found" | Update Database ID in wrangler.toml |
| "Tables don't exist" | Run: `wrangler d1 execute envision_db --file=./backend/migrations/0001_schema.sql` |
| CORS errors | Already configured, check browser console |
| Slow queries | Add indexes or limit results |

---

## **📚 USEFUL COMMANDS**

```bash
# Development
npm run worker:dev          # Local testing
npm run worker:deploy       # Deploy to production
npm run worker:tail         # View live logs

# Database
wrangler d1 list            # List all databases
wrangler d1 execute envision_db --command "SELECT * FROM events LIMIT 5;"
```

---

## **📖 FULL DOCUMENTATION**

See `CLOUDFLARE_D1_DEPLOYMENT_GUIDE.md` for complete details.

---

## **✨ YOU'RE DONE!**

Your event management system is now:
- **Running on Cloudflare** ☁️
- **Globally distributed** 🌍
- **Auto-scaling** 📈
- **Production-ready** 🚀

**Next:** Update your frontend to use the new API URL!

---

**Questions?** Check the main deployment guide or Cloudflare docs:
- https://developers.cloudflare.com/d1/
- https://developers.cloudflare.com/workers/
