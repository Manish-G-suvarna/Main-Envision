# Cloudflare D1 Deployment Guide - Envision Event Management

## Overview
This guide walks you through deploying your Envision database to **Cloudflare D1** (serverless SQLite edge database) with Cloudflare Workers for API handling.

---

## **PREREQUISITES**

- Node.js 18+ installed
- Cloudflare account (free tier works fine for testing)
- Git
- A domain (optional, for custom domain setup)

---

## **STEP-BY-STEP DEPLOYMENT**

### **STEP 1: Install Wrangler CLI**

```bash
# Install Wrangler globally
npm install -g wrangler

# Or install locally in your project (recommended)
npm install --save-dev wrangler

# Verify installation
wrangler --version
```

### **STEP 2: Authenticate with Cloudflare**

```bash
# Login to your Cloudflare account
wrangler login

# You'll be redirected to authorize the CLI
# Copy the API token displayed
```

### **STEP 3: Create D1 Database**

```bash
# Create the D1 database
wrangler d1 create envision_db

# Output will show:
# ✓ Successfully created DB 'envision_db'
# Binding: d1 = "envision_db"
# Database ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**⚠️ IMPORTANT:** Save the **Database ID** - you'll need it in the next step.

### **STEP 4: Update wrangler.toml**

Edit `wrangler.toml` and replace `YOUR_DATABASE_ID_HERE` with your actual Database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "envision_db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # ← Replace this
```

### **STEP 5: Initialize Database Schema**

Apply the migration file to populate your database:

```bash
# Execute the schema migration
wrangler d1 execute envision_db --file=./backend/migrations/0001_schema.sql

# You should see output confirming the tables were created and data inserted
```

**Verify the schema was created:**

```bash
# List all tables
wrangler d1 execute envision_db --command "SELECT name FROM sqlite_master WHERE type='table';"

# Should show: teams, departments, events, core_team
```

### **STEP 6: Install Dependencies**

```bash
# Install Node dependencies for the project
npm install

# Verify wrangler is in node_modules
npx wrangler --version
```

### **STEP 7: Test Locally with Dev Server**

```bash
# Start the local development server
npm run worker:dev

# You should see:
# ⛅ wrangler dev
# [wrangler] Starting local server...
# [wrangler] Ready on http://localhost:8787

# Open another terminal and test the API
curl http://localhost:8787/api/health
```

**Expected Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2024-02-16T10:30:00.000Z",
  "environment": "production",
  "version": "2.0.0 (Cloudflare D1)"
}
```

### **STEP 8: Test API Endpoints**

```bash
# Get all events
curl http://localhost:8787/api/events

# Get team information
curl http://localhost:8787/api/team

# Get core team members
curl http://localhost:8787/api/team/core
```

### **STEP 9: Update Frontend API URLs**

Update your React frontend to use the new Cloudflare URLs:

**In your frontend code (e.g., `src/api/axiosConfig.js`):**

```javascript
// Development
const API_BASE = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8787'  // Local Wrangler dev server
  : 'https://envision-api.<your-workers-domain>.workers.dev'; // Production

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### **STEP 10: Deploy to Cloudflare**

```bash
# Deploy the Worker and Database to Cloudflare
npm run worker:deploy

# Output will show:
# ✓ Deployed example-api
# ✓ Deployed example-api
# ✓ Uploaded 1 script to Cloudflare
# Website: https://envision-api.{random}.workers.dev
```

**Save your Worker URL** - this is your production API endpoint.

### **STEP 11: Verify Production Deployment**

```bash
# Test the health endpoint
curl https://envision-api.{your-worker-url}.workers.dev/api/health

# Test API endpoints
curl https://envision-api.{your-worker-url}.workers.dev/api/events
```

---

## **IMPORTANT: Database ID LOCATIONS**

You need to update `wrangler.toml` with your database ID in multiple places:

### Option 1: Using Wrangler Binding (Recommended)
```toml
[[d1_databases]]
binding = "DB"
database_name = "envision_db"
database_id = "YOUR_DATABASE_ID"
```

### Option 2: Check Your Database ID
```bash
# List all D1 databases
wrangler d1 list

# Shows all databases with their IDs
```

---

## **DEPLOYMENT ARCHITECTURE**

```
┌─────────────────┐
│  React Frontend │
│   (Vite/Build)  │
└────────┬────────┘
         │
         │ API Requests
         ▼
┌──────────────────────────────┐
│  Cloudflare Workers          │
│  (API Handler - index.ts)    │
└──────────────┬───────────────┘
               │
               │ Database Queries
               ▼
         ┌──────────────┐
         │ Cloudflare D1│
         │ (SQLite DB)  │
         └──────────────┘
```

---

## **ENVIRONMENT VARIABLES**

If you need environment variables, add them to `wrangler.toml`:

```toml
[env.production]
vars = { ENVIRONMENT = "production", API_VERSION = "2.0" }

[env.development]
vars = { ENVIRONMENT = "development", API_VERSION = "2.0-dev" }
```

Access in code:
```typescript
const env = { DB, ENVIRONMENT };
```

---

## **COMMON ISSUES & SOLUTIONS**

### ❌ "Database not found" Error
**Solution:** Make sure you've updated `wrangler.toml` with the correct Database ID and executed the migration.

```bash
wrangler d1 execute envision_db --file=./backend/migrations/0001_schema.sql
```

### ❌ "Tables don't exist" Error
**Solution:** Re-run the migration:
```bash
wrangler d1 execute envision_db --file=./backend/migrations/0001_schema.sql --remote
```

### ❌ CORS Errors in Frontend
**Solution:** The API already has CORS headers configured. If still issues, check:
```bash
npm run worker:dev
# Test with curl -i to see all headers
```

### ❌ Worker Timeout
**Solution:** D1 queries might timeout with large datasets. Optimize queries or add pagination.

---

## **MONITORING & LOGS**

### View Live Logs
```bash
# Stream logs from production
npm run worker:tail

# Or use full command
wrangler tail --env production
```

### View Analytics
1. Go to Cloudflare Dashboard
2. Navigate to Workers → envision-api
3. Check Analytics & Metrics

---

## **SCALING & OPTIMIZATION**

### Add Caching
```typescript
// In your route handler
const cache = caches.default;
const cachedResponse = await cache.match(request);
if (cachedResponse) return cachedResponse;
```

### Database Optimization
```sql
-- Add more indexes if needed
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_departments_id ON departments(id);
```

### Batch Operations
For bulk inserts, group them:
```typescript
const tx = env.DB.batch([
  query1,
  query2,
  query3
]);
await tx;
```

---

## **NEXT STEPS**

1. ✅ Database is live on Cloudflare D1
2. 🔄 Update frontend to use new API URLs
3. 📊 Set up monitoring and logging
4. 🔐 Add authentication/authorization to API routes
5. 🚀 Deploy frontend to Cloudflare Pages
6. 📈 Monitor performance and optimize queries

---

## **CONNECTING FRONTEND & BACKEND**

### Update API Configuration

Create/update `src/config/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:8787'
    : 'https://envision-api.{your-worker-url}.workers.dev'
  );

export default API_URL;
```

In `.env.local`:
```
VITE_API_URL=https://envision-api.{your-worker-url}.workers.dev
```

### Update API Calls

Before (old Express backend):
```javascript
const response = await axios.get('http://localhost:5000/api/events');
```

After (Cloudflare Workers):
```javascript
const response = await axios.get('https://envision-api.{your-worker-url}.workers.dev/api/events');
```

---

## **BACKUP & RECOVERY**

### Backup your D1 Database
```bash
# Export database to SQL file
wrangler d1 execute envision_db --command "SELECT * FROM teams;" > teams_backup.sql
```

### Restore from Backup
```bash
# Restore the migration
wrangler d1 execute envision_db --file=./backend/migrations/0001_schema.sql
```

---

## **USEFUL COMMANDS**

```bash
# List all D1 databases
wrangler d1 list

# Execute raw SQL
wrangler d1 execute envision_db --command "SELECT COUNT(*) as count FROM events;"

# Local development
npm run worker:dev

# Deploy to production
npm run worker:deploy

# View live logs
npm run worker:tail

# Execute file locally
wrangler d1 execute envision_db --file=./migrations/file.sql --local

# Execute file in production
wrangler d1 execute envision_db --file=./migrations/file.sql --remote
```

---

## **SUPPORT & RESOURCES**

- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Cloudflare Workers Guide](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Community Discord](https://discord.gg/cloudflaredev)

---

## **Summary**

Your Envision Event Management system is now running on:
- **Frontend:** React/Vite
- **API:** Cloudflare Workers (TypeScript)
- **Database:** Cloudflare D1 (SQLite)
- **Hosting:** Cloudflare (Free tier available)

All data is replicated across Cloudflare's global edge network for ultra-low latency! 🚀
