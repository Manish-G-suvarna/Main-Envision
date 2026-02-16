# 👥 Collaborator Setup Guide - Cloudflare D1 Deployment

**Status:** Database is live on Cloudflare D1. API is ready to deploy.

This guide explains what you need to do as a collaborator to deploy the API to Cloudflare Workers.

---

## 📊 Current Status

✅ **Database:** Live on Cloudflare D1
- Database ID: `3c276ad7-eea8-4bf4-82af-391c93dceb15`
- Tables: 4 (teams, departments, events, core_team)
- Data: 48 sample records
- Status: **READY TO USE**

✅ **API Code:** Ready to deploy
- Location: `src/index.ts`, `src/routes/*.ts`
- Language: TypeScript
- Runtime: Cloudflare Workers
- Status: **READY TO DEPLOY**

✅ **Configuration:** Set up
- File: `wrangler.toml` (Database ID already added)
- File: `tsconfig.json` (complete)
- File: `package.json` (updated with scripts)
- Status: **READY**

---

## ✅ PREREQUISITES

Before you start, ensure you have:

- [ ] Node.js 18+ installed
  ```bash
  node --version  # Should show v18 or higher
  ```

- [ ] Cloudflare account
  - Sign up: https://dash.cloudflare.com
  - Use the same account for consistency
  - Ask the owner for access if using a team account

- [ ] Git (already cloned this repo)

---

## 🚀 YOUR TASKS

### Task 1: Install Dependencies
```bash
npm install
```

This installs:
- Wrangler CLI (Cloudflare deployment tool)
- TypeScript
- All other Node modules

### Task 2: Authenticate with Cloudflare
```bash
npx wrangler login
```

This will:
1. Open your browser
2. Ask you to authorize the CLI
3. Redirect back to terminal

**Important:** Use the same Cloudflare account as the repository owner for consistency.

### Task 3: Test Locally
```bash
npm run worker:dev
```

This starts a local development server at `http://localhost:8787`

**In another terminal, test the API:**
```bash
# Test health check
curl http://localhost:8787/api/health

# Test events endpoint
curl http://localhost:8787/api/events

# Test team endpoint
curl http://localhost:8787/api/team
```

You should see JSON responses with:
- ✅ Events list (23 events)
- ✅ Team list (4 teams)
- ✅ Health status

**Stop the dev server:** Press `Ctrl+C` in the terminal

### Task 4: Deploy to Production
```bash
npm run worker:deploy
```

This will:
1. Compile your TypeScript code
2. Upload to Cloudflare
3. Deploy to edge network
4. Show you the live URL

**Expected output:**
```
✓ Uploaded 1 script to Cloudflare
Website: https://envision-api.xxxxx.workers.dev
```

**Save this URL** - you'll need it for the frontend!

### Task 5: Test Production API
```bash
curl https://envision-api.xxxxx.workers.dev/api/events
```

Should return the same data as the local test.

### Task 6: Update Frontend API URL
In your React code, find where the API URL is defined:

**Old:**
```javascript
const API_URL = 'http://localhost:5000'
```

**New:**
```javascript
const API_URL = 'https://envision-api.xxxxx.workers.dev'
```

Files to update:
- `src/api/axiosConfig.js` (or similar)
- `.env` or `.env.local` files
- Any hardcoded `localhost:5000` references

---

## 📋 Step-by-Step Checklist

Follow these in order:

```
☐ 1. Clone/Pull the repo with these new files
☐ 2. Run: npm install
☐ 3. Run: npx wrangler login
☐ 4. Run: npm run worker:dev
☐ 5. Test locally: curl http://localhost:8787/api/events
☐ 6. Stop dev server (Ctrl+C)
☐ 7. Run: npm run worker:deploy
☐ 8. Save the Worker URL shown
☐ 9. Test production: curl https://envision-api.xxxxx.workers.dev/api/events
☐ 10. Update frontend API URLs
☐ 11. Test frontend with new API
☐ 12. ✅ DONE!
```

---

## 🎯 What's Already Done For You

✅ Database created and populated
✅ API code written in TypeScript
✅ Wrangler configuration done
✅ Migration files ready
✅ Package scripts set up
✅ TypeScript config complete
✅ CORS headers configured
✅ Error handling implemented

**You just need to:** Deploy the API and update frontend URLs!

---

## 📚 Available Commands

```bash
# Development
npm run worker:dev          # Test locally
npm run worker:deploy       # Deploy to production
npm run worker:tail         # View live logs

# Database (if needed)
npx wrangler d1 list        # List all databases
npx wrangler d1 execute envision_db --command "SELECT * FROM events LIMIT 5;"

# Git
git status
git add .
git commit -m "message"
git push
```

---

## 🌐 API ENDPOINTS

Once deployed, these endpoints will be available:

```
GET /api/health
  → Returns server status

GET /api/events
  → Returns all 23 events

GET /api/events/:departmentId
  → Returns events for specific department

GET /api/team
  → Returns all 4 teams with member count

GET /api/team/core
  → Returns core team members grouped by team
```

**Example:**
```bash
curl https://envision-api.xxxxx.workers.dev/api/events | jq
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Wrangler not found" | Run: `npm install` |
| "Not authenticated" | Run: `npx wrangler login` |
| API not responding locally | Check dev server is running: `npm run worker:dev` |
| Deployment fails | Check `wrangler.toml` has correct Database ID |
| CORS errors in frontend | Verify API URL doesn't have typos |
| Database queries fail | Check you deployed the schema: migration was auto-deployed |

---

## 📖 ADDITIONAL RESOURCES

Full guides available in the repo:

- **[`START_HERE.md`](START_HERE.md)** - Overview
- **[`QUICK_START.md`](QUICK_START.md)** - 5-minute quick reference
- **[`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md)** - Detailed steps
- **[`CLOUDFLARE_D1_DEPLOYMENT_GUIDE.md`](CLOUDFLARE_D1_DEPLOYMENT_GUIDE.md)** - Complete reference
- **[`FILES_CREATED.md`](FILES_CREATED.md)** - File structure reference

---

## 💾 Database Connection Details

The database is already configured in `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "envision_db"
database_id = "3c276ad7-eea8-4bf4-82af-391c93dceb15"
```

**No changes needed** - just deploy the API!

---

## 🔐 Security Notes

✅ Already configured:
- CORS headers for API access
- HTTPS only
- SQL injection protection
- DDoS protection via Cloudflare

⚠️ Future enhancements (optional):
- Add API authentication
- Add rate limiting
- Use environment variables for secrets

---

## 📊 Architecture

```
Your React App
    ↓
Cloudflare Workers (Your API)
    ↓
Cloudflare D1 (Database)
    ↓
✅ Global edge network - ultra-fast!
```

---

## ✨ Expected Result

After completing all steps:

✅ API running locally at `http://localhost:8787`
✅ API deployed to Cloudflare at `https://envision-api.xxxxx.workers.dev`
✅ Frontend updated with new API URL
✅ All data displays correctly
✅ Zero errors in console
✅ Production-ready serverless system

---

## 📝 Important Notes

1. **Database ID is locked:** It's in `wrangler.toml` and ready to use
2. **No migrations needed:** Database is already populated
3. **Consistent URLs:** All collaborators will have same Worker URL
4. **Team account:** If using a team Cloudflare account, ensure all members have access

---

## 🎯 Success Criteria

You've successfully completed setup when:

- [ ] Local dev server starts without errors
- [ ] `curl http://localhost:8787/api/events` returns event data
- [ ] Deployment completes successfully
- [ ] `curl https://envision-api.xxxxx.workers.dev/api/events` returns data
- [ ] Frontend API URLs updated
- [ ] Frontend displays data from Cloudflare API
- [ ] No errors in browser console

---

## 💬 Need Help?

1. **Questions about setup?** → Check [`QUICK_START.md`](QUICK_START.md)
2. **Step-by-step help?** → Follow [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md)
3. **Technical details?** → Read [`CLOUDFLARE_D1_DEPLOYMENT_GUIDE.md`](CLOUDFLARE_D1_DEPLOYMENT_GUIDE.md)
4. **File reference?** → See [`FILES_CREATED.md`](FILES_CREATED.md)

---

## 🚀 Ready to Deploy?

1. Install dependencies: `npm install`
2. Login: `npx wrangler login`
3. Test locally: `npm run worker:dev`
4. Deploy: `npm run worker:deploy`
5. Update frontend
6. Done! ✅

**Estimated time:** 10-15 minutes

---

**Repository Status:** ✅ Ready for collaborators to deploy
**Database:** ✅ Live on Cloudflare D1
**API Code:** ✅ Ready to deploy
**Configuration:** ✅ Complete

Good luck! Your API is about to go live! 🚀
