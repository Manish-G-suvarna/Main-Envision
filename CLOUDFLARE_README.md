# 🚀 Cloudflare D1 Deployment for Envision

Deploy your event management database to **Cloudflare D1** (serverless SQLite) with **Cloudflare Workers** (serverless API).

---

## ⚡ QUICK START (3 MINUTES)

### Windows
```batch
DEPLOY.bat
```

### macOS/Linux
```bash
chmod +x DEPLOY.sh && ./DEPLOY.sh
```

### Result
✅ Database live on Cloudflare D1
✅ API running on Cloudflare Workers
✅ Global edge distribution

---

## 📖 CHOOSE YOUR GUIDE

### 🚀 **I just want to deploy quickly**
→ Read: [`QUICK_START.md`](QUICK_START.md) (5 min)

### ✅ **I want step-by-step instructions**
→ Read: [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md) (20 min)

### 📚 **I want complete documentation**
→ Read: [`CLOUDFLARE_D1_DEPLOYMENT_GUIDE.md`](CLOUDFLARE_D1_DEPLOYMENT_GUIDE.md) (30 min)

### 📝 **I want to know what was created**
→ Read: [`FILES_CREATED.md`](FILES_CREATED.md) (10 min)

### 📊 **I want the complete overview**
→ Read: [`CLOUDFLARE_SETUP_COMPLETE.md`](CLOUDFLARE_SETUP_COMPLETE.md) (15 min)

---

## 🎯 BEFORE YOU START

Check you have:
- ✅ Node.js 18+ installed
- ✅ Cloudflare account (free tier OK)
- ✅ Terminal/Command Prompt
- ✅ This repository cloned

---

## 🔧 WHAT'S BEEN SET UP

### Database
```
✅ Cloudflare D1 (SQLite)
   ├── teams (4 records)
   ├── departments (12 records)
   ├── events (23 records)
   └── core_team (9 records)
```

### API
```
✅ Cloudflare Workers (TypeScript)
   ├── GET /api/health
   ├── GET /api/events
   ├── GET /api/events/:departmentId
   ├── GET /api/team
   └── GET /api/team/core
```

### Configuration
```
✅ wrangler.toml (needs Database ID)
✅ tsconfig.json (complete)
✅ package.json (updated with scripts)
```

### Migrations
```
✅ backend/migrations/0001_schema.sql
   (Ready to deploy)
```

### Automation
```
✅ DEPLOY.bat (Windows)
✅ DEPLOY.sh (macOS/Linux)
```

---

## 📊 ARCHITECTURE

```
┌─────────────────────────────────┐
│      Your React Frontend        │
│         (Vite)                  │
└────────────┬────────────────────┘
             │
             │ API Calls
             ▼
┌─────────────────────────────────┐
│    Cloudflare Workers           │
│    (API - TypeScript)           │
│  ☁️  Global Edge Network        │
└────────────┬────────────────────┘
             │
             │ Database Queries
             ▼
┌─────────────────────────────────┐
│      Cloudflare D1              │
│    (SQLite Database)            │
│  ☁️  Global Edge Network        │
└─────────────────────────────────┘
```

---

## 💰 COSTS

| Service | Free Tier | Cost |
|---------|-----------|------|
| D1 Database | 5GB | $0-5/mo |
| Workers | 100K req/day | $0.50/mo |
| Pages | Unlimited | FREE |
| **Total** | Generous | **~$0-6/mo** |

---

## 📋 DEPLOYMENT SUMMARY

| Step | Time | Status |
|------|------|--------|
| 1. Install Wrangler | 2 min | ✅ Ready |
| 2. Create D1 DB | 2 min | ✅ Ready |
| 3. Deploy Schema | 1 min | ✅ Ready |
| 4. Test Locally | 3 min | ✅ Ready |
| 5. Deploy to Cloud | 2 min | ✅ Ready |
| 6. Update Frontend | 5 min | 📝 Your Task |
| **TOTAL** | **15 min** | **✅ GO!** |

---

## 🚀 ONE-COMMAND DEPLOYMENT

```bash
# Run this and follow the prompts (Windows users: run DEPLOY.bat instead)
./DEPLOY.sh
```

**What it does:**
1. ✅ Installs Wrangler
2. ✅ Authenticates with Cloudflare
3. ✅ Creates D1 database
4. ✅ Deploys database schema
5. ✅ Installs dependencies
6. ✅ Verifies everything works

---

## 🧪 TEST YOUR DEPLOYMENT

### Local Testing
```bash
npm run worker:dev
```

Then in another terminal:
```bash
# Test health check
curl http://localhost:8787/api/health

# Test events
curl http://localhost:8787/api/events

# Test team
curl http://localhost:8787/api/team
```

### Production Testing
After `npm run worker:deploy`, test your live API:
```bash
curl https://envision-api.xxxxx.workers.dev/api/events
```

---

## 🔄 UPDATE FRONTEND

Once deployed, update your React code:

```javascript
// OLD (Express backend)
const API = 'http://localhost:5000'

// NEW (Cloudflare Workers)
const API = 'https://envision-api.xxxxx.workers.dev'
```

---

## 📚 DOCUMENTATION MAP

```
START HERE
    │
    ├─→ QUICK_START.md (5 min)
    │   └─→ Ready to deploy? GO!
    │
    ├─→ DEPLOYMENT_CHECKLIST.md (20 min)
    │   └─→ Step-by-step guide with verification
    │
    ├─→ CLOUDFLARE_D1_DEPLOYMENT_GUIDE.md (30 min)
    │   └─→ Complete reference with troubleshooting
    │
    ├─→ CLOUDFLARE_SETUP_COMPLETE.md (15 min)
    │   └─→ Overview of everything prepared
    │
    └─→ FILES_CREATED.md (10 min)
        └─→ Reference for all created files
```

---

## ⚠️ IMPORTANT: DATABASE ID

When you create the database, you'll get a **Database ID**:

```bash
wrangler d1 create envision_db
# Output shows:
# Database ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx ← SAVE THIS
```

You must add it to `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "envision_db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  ← PASTE HERE
```

---

## 🆘 QUICK TROUBLESHOOTING

| Issue | Fix |
|-------|-----|
| `wrangler: command not found` | `npm install --save-dev wrangler` |
| Not logged in | `wrangler login` |
| Database ID error | Update `wrangler.toml` with your ID |
| Tables not found | Run: `wrangler d1 execute envision_db --file=./backend/migrations/0001_schema.sql` |
| CORS errors | Check API URL in frontend code |

**Need more help?** See [`CLOUDFLARE_D1_DEPLOYMENT_GUIDE.md`](CLOUDFLARE_D1_DEPLOYMENT_GUIDE.md)

---

## 🎯 NEXT STEPS

1. **Choose a guide above** ☝️
2. **Follow the steps**
3. **Deploy!** 🚀
4. **Update frontend** 📱
5. **Celebrate!** 🎉

---

## 📞 RESOURCES

- 📖 [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- 📖 [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- 💬 [Cloudflare Discord](https://discord.gg/cloudflaredev)
- 🐛 [Report Issues](https://github.com/cloudflare/wrangler)

---

## ✅ STATUS

```
[████████████████████████████████████████████] 100%

✅ Database Schema        - READY
✅ API Code              - READY
✅ Configuration Files   - READY (1 field needed)
✅ Documentation         - COMPLETE
✅ Automation Scripts    - READY

STATUS: DEPLOYMENT READY
```

---

## 🚀 BEGIN NOW!

### **Windows Users:**
```batch
DEPLOY.bat
```

### **macOS/Linux Users:**
```bash
chmod +x DEPLOY.sh
./DEPLOY.sh
```

### **Or Read First:**
- 🏃 **Quick?** → [`QUICK_START.md`](QUICK_START.md)
- 📋 **Detailed?** → [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md)
- 📚 **Complete?** → [`CLOUDFLARE_D1_DEPLOYMENT_GUIDE.md`](CLOUDFLARE_D1_DEPLOYMENT_GUIDE.md)

---

**Your serverless event management system is ready. Deploy now!** 🎯

---

*Created: February 2026 | Envision Event Management | Cloudflare D1*
