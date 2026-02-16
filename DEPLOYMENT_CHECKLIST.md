# ✅ Cloudflare D1 Deployment Checklist

Follow this checklist to deploy your Envision database to Cloudflare D1.

---

## **PRE-DEPLOYMENT** 🔧

- [ ] Have Node.js 18+ installed
- [ ] Have a Cloudflare account (free tier OK)
- [ ] Have git installed
- [ ] Terminal/Command Prompt ready

---

## **STEP 1: INSTALL WRANGLER** 📦

```bash
npm install --save-dev wrangler
```

- [ ] Command completed successfully
- [ ] Verify: `wrangler --version` shows version number

---

## **STEP 2: LOGIN TO CLOUDFLARE** 🔐

```bash
wrangler login
```

- [ ] Browser opened for authentication
- [ ] Clicked authorize
- [ ] Terminal confirmed login

---

## **STEP 3: CREATE D1 DATABASE** 🗄️

```bash
wrangler d1 create envision_db
```

- [ ] Output shows "Successfully created DB 'envision_db'"
- [ ] **IMPORTANT:** Copy the `Database ID` value shown
- [ ] Save Database ID somewhere safe

**Your Database ID:** `_____________________________`

---

## **STEP 4: UPDATE wrangler.toml** ⚙️

Open `wrangler.toml` and find this section:

```toml
[[d1_databases]]
binding = "DB"
database_name = "envision_db"
database_id = "YOUR_DATABASE_ID_HERE"  ← REPLACE THIS
```

- [ ] Opened wrangler.toml in editor
- [ ] Replaced `YOUR_DATABASE_ID_HERE` with your Database ID
- [ ] Saved the file

---

## **STEP 5: INITIALIZE DATABASE** 🚀

```bash
wrangler d1 execute envision_db --file=./backend/migrations/0001_schema.sql
```

- [ ] Command completed without errors
- [ ] Migration file was executed
- [ ] Database populated with tables and data

---

## **STEP 6: VERIFY TABLES** 🔍

```bash
wrangler d1 execute envision_db --command "SELECT name FROM sqlite_master WHERE type='table';"
```

You should see:
- [ ] `core_team`
- [ ] `departments`
- [ ] `events`
- [ ] `teams`

---

## **STEP 7: INSTALL DEPENDENCIES** 📚

```bash
npm install
```

- [ ] All dependencies installed
- [ ] No errors in output
- [ ] node_modules folder exists

---

## **STEP 8: TEST LOCALLY** 🧪

```bash
npm run worker:dev
```

Should see output like:
```
⛅ wrangler dev
[wrangler] Starting local server...
[wrangler] Ready on http://localhost:8787
```

- [ ] Server started successfully
- [ ] Shows "Ready on http://localhost:8787"
- [ ] Terminal ready for next command

**In another terminal:**

```bash
curl http://localhost:8787/api/health
curl http://localhost:8787/api/events
curl http://localhost:8787/api/team
```

- [ ] `/api/health` returns status message
- [ ] `/api/events` returns event list
- [ ] `/api/team` returns team information
- [ ] All responses are valid JSON

---

## **STEP 9: DEPLOY TO PRODUCTION** 🚀

```bash
npm run worker:deploy
```

Should see output like:
```
✓ Deployed example-api
✓ Uploaded 1 script to Cloudflare
Website: https://envision-api.xxxxx.workers.dev
```

- [ ] Deployment successful
- [ ] Got a Worker URL (save it!)
- [ ] No errors in output

**Your Production URL:** `https://envision-api.________________.workers.dev`

---

## **STEP 10: VERIFY PRODUCTION** 🌐

Test your live API:

```bash
curl https://envision-api.xxxxx.workers.dev/api/health
curl https://envision-api.xxxxx.workers.dev/api/events
```

- [ ] Health check returns status
- [ ] Events endpoint returns data
- [ ] All responses have correct CORS headers
- [ ] No errors

---

## **STEP 11: UPDATE FRONTEND** 📱

In your React code, find where you define the API URL:

**Old (Express backend):**
```javascript
const API_URL = 'http://localhost:5000'
```

**New (Cloudflare Workers):**
```javascript
const API_URL = 'https://envision-api.xxxxx.workers.dev'
```

Files to update:
- [ ] `src/api/axiosConfig.js` or similar
- [ ] Any hardcoded localhost:5000 URLs
- [ ] Environment files (.env, .env.local)

---

## **STEP 12: TEST FULL INTEGRATION** 🔗

- [ ] Frontend loads without errors
- [ ] Events page displays data from Cloudflare
- [ ] Team page shows team information
- [ ] No CORS errors in browser console
- [ ] All API calls succeed

---

## **STEP 13: MONITOR & LOGS** 📊

```bash
npm run worker:tail
```

- [ ] Command shows live logs
- [ ] Can see API requests coming through
- [ ] No errors in logs

---

## **POST-DEPLOYMENT** 🎉

### Cleanup (Optional)

```bash
# Old Express backend no longer needed if fully migrated
# But keep for reference initially
rm -r backend  # Only if 100% sure you're done with Express
```

- [ ] Decide whether to keep old Express backend (recommended: keep as backup)

### Backup

```bash
# Backup your D1 database
wrangler d1 execute envision_db --command "SELECT * FROM events;" > events_backup.sql
```

- [ ] Created database backups
- [ ] Stored backups safely

### Documentation

- [ ] Read: `QUICK_START.md` (quick reference)
- [ ] Read: `CLOUDFLARE_D1_DEPLOYMENT_GUIDE.md` (detailed info)
- [ ] Read: `FILES_CREATED.md` (file reference)

---

## **COMMON ISSUES** ⚠️

### Issue: "Database not found" Error

**Solution:**
```bash
# Check your Database ID is in wrangler.toml
# Then run:
wrangler d1 list
```

### Issue: "Tables don't exist" Error

**Solution:**
```bash
# Re-run the migration
wrangler d1 execute envision_db --file=./backend/migrations/0001_schema.sql --remote
```

### Issue: CORS Errors in Frontend

**Solution:** CORS is already configured. Check:
1. Correct API URL in frontend code
2. No typos in domain
3. Clear browser cache

### Issue: API Timeout

**Solution:** Optimize your queries:
```sql
-- Add indexes
CREATE INDEX idx_events_department ON events(department_id);
```

---

## **USEFUL COMMANDS REFERENCE**

```bash
# Development
npm run worker:dev              # Local testing
npm run worker:deploy           # Deploy to production
npm run worker:tail             # View live logs

# Database
wrangler d1 list                # List all D1 databases
wrangler d1 describe envision_db # Database details
wrangler d1 execute envision_db --command "SELECT * FROM events LIMIT 5;" # Query
```

---

## **SUCCESS CRITERIA** ✨

You're done when:

✅ Cloudflare account has envision_db database
✅ D1 database has all 4 tables with data
✅ Local dev server works (`npm run worker:dev`)
✅ All API endpoints respond correctly locally
✅ Worker deployed to Cloudflare
✅ Production API endpoints respond
✅ Frontend updated to use new API URL
✅ Frontend displays data from Cloudflare
✅ No errors in browser console
✅ Can monitor logs with `npm run worker:tail`

---

## **SUMMARY**

| Component | Status | Location |
|-----------|--------|----------|
| Database | ✅ Cloudflare D1 | Cloud |
| API | ✅ Cloudflare Workers | Cloud |
| Frontend | ✅ React/Vite | Local or Cloudflare Pages |
| Hosting | ✅ Completely serverless | Cloudflare |

---

## **SUPPORT RESOURCES**

📖 **Documentation:**
- Quick Start: `QUICK_START.md`
- Full Guide: `CLOUDFLARE_D1_DEPLOYMENT_GUIDE.md`
- File Reference: `FILES_CREATED.md`

🔗 **Official Docs:**
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

💬 **Community:**
- [Cloudflare Discord](https://discord.gg/cloudflaredev)
- [Cloudflare Community](https://community.cloudflare.com/)

---

## **NEXT STEPS** 🎯

1. ✅ Complete this checklist
2. 📱 Deploy frontend to Cloudflare Pages
3. 🔐 Add authentication to API routes
4. 📊 Set up analytics and monitoring
5. 🚀 Plan for scale

---

**Date Started:** ___________________
**Date Completed:** ___________________
**Notes:** ____________________________________________________________

---

**Status:** Ready for Production ✅
**Last Updated:** February 2026
**Version:** 2.0.0
