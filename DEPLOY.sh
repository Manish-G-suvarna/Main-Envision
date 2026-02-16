#!/bin/bash

# Cloudflare D1 Deployment Script for Envision
# This script automates the deployment process

set -e

echo "═══════════════════════════════════════════════════════════"
echo "🚀 Envision - Cloudflare D1 Deployment Script"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Step 1: Check if wrangler is installed
echo "📦 Step 1: Checking Wrangler installation..."
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler is not installed globally"
    echo "📥 Installing wrangler..."
    npm install --save-dev wrangler
else
    echo "✅ Wrangler is installed"
fi
echo ""

# Step 2: Check if logged in to Cloudflare
echo "🔐 Step 2: Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "⚠️  Not logged in to Cloudflare. Please login..."
    wrangler login
else
    ACCOUNT=$(wrangler whoami)
    echo "✅ Logged in as: $ACCOUNT"
fi
echo ""

# Step 3: List existing databases
echo "📊 Step 3: Checking existing D1 databases..."
echo "Your current D1 databases:"
wrangler d1 list || echo "No databases found (this is OK on first run)"
echo ""

# Step 4: Check if database exists
echo "🔍 Step 4: Checking if envision_db exists..."
DB_EXISTS=$(wrangler d1 list 2>/dev/null | grep -c "envision_db" || echo "0")

if [ "$DB_EXISTS" -eq 0 ]; then
    echo "📝 Creating new D1 database 'envision_db'..."
    wrangler d1 create envision_db
    echo "⚠️  Please update the database_id in wrangler.toml with the ID shown above"
    echo ""
    read -p "Press Enter after updating wrangler.toml..."
else
    echo "✅ Database 'envision_db' already exists"
fi
echo ""

# Step 5: Initialize database schema
echo "🗂️  Step 5: Initializing database schema..."
if [ -f "backend/migrations/0001_schema.sql" ]; then
    echo "Running migration file..."
    wrangler d1 execute envision_db --file=./backend/migrations/0001_schema.sql
    echo "✅ Schema initialized successfully"
else
    echo "❌ Migration file not found: backend/migrations/0001_schema.sql"
    exit 1
fi
echo ""

# Step 6: Install dependencies
echo "📚 Step 6: Installing Node.js dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 7: Verify schema
echo "🔍 Step 7: Verifying database tables..."
echo "Tables in envision_db:"
wrangler d1 execute envision_db --command "SELECT name FROM sqlite_master WHERE type='table';" || echo "Could not verify tables"
echo ""

# Step 8: Summary
echo "═══════════════════════════════════════════════════════════"
echo "✅ Deployment Setup Complete!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📋 Next Steps:"
echo "  1. Test locally:    npm run worker:dev"
echo "  2. Deploy to prod:  npm run worker:deploy"
echo "  3. View logs:       npm run worker:tail"
echo ""
echo "🌐 API Endpoints:"
echo "  Local:  http://localhost:8787/api/events"
echo "  Prod:   https://envision-api.<your-id>.workers.dev/api/events"
echo ""
echo "📖 For detailed guide, see: CLOUDFLARE_D1_DEPLOYMENT_GUIDE.md"
echo "═══════════════════════════════════════════════════════════"
