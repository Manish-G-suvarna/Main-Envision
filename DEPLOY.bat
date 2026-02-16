@echo off
REM Cloudflare D1 Deployment Script for Envision (Windows)

cls
echo ============================================================
echo         Envision - Cloudflare D1 Deployment
echo ============================================================
echo.

REM Step 1: Check npm installation
echo [STEP 1] Checking npm installation...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed. Please install Node.js first.
    pause
    exit /b 1
)
echo OK - npm is installed
echo.

REM Step 2: Install wrangler if not present
echo [STEP 2] Checking Wrangler installation...
where wrangler >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing wrangler locally...
    call npm install --save-dev wrangler
)
echo OK - Wrangler is available
echo.

REM Step 3: Login to Cloudflare
echo [STEP 3] Authenticating with Cloudflare...
call npx wrangler whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Please login to Cloudflare...
    call npx wrangler login
)
echo OK - Logged in to Cloudflare
echo.

REM Step 4: Create D1 database
echo [STEP 4] Setting up D1 database...
call npx wrangler d1 list | find "envision_db" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Creating new D1 database 'envision_db'...
    call npx wrangler d1 create envision_db
    echo.
    echo ^^!^^! IMPORTANT ^^!^^!
    echo Copy the Database ID from above and update:
    echo   File: wrangler.toml
    echo   Line: database_id = "PASTE_ID_HERE"
    echo.
    pause
) else (
    echo OK - Database 'envision_db' already exists
)
echo.

REM Step 5: Install dependencies
echo [STEP 5] Installing dependencies...
call npm install
echo OK - Dependencies installed
echo.

REM Step 6: Run migration
echo [STEP 6] Initializing database schema...
if exist "backend\migrations\0001_schema.sql" (
    call npx wrangler d1 execute envision_db --file=.\backend\migrations\0001_schema.sql
    echo OK - Schema initialized
) else (
    echo ERROR: Migration file not found
    echo Expected: backend\migrations\0001_schema.sql
    pause
    exit /b 1
)
echo.

REM Step 7: Verify schema
echo [STEP 7] Verifying database...
call npx wrangler d1 execute envision_db --command "SELECT COUNT(*) as table_count FROM sqlite_master WHERE type='table';"
echo OK - Database verified
echo.

REM Summary
echo ============================================================
echo              SETUP COMPLETE!
echo ============================================================
echo.
echo NEXT STEPS:
echo   1. Test locally:    npm run worker:dev
echo   2. Deploy to prod:  npm run worker:deploy
echo   3. View logs:       npm run worker:tail
echo.
echo API ENDPOINTS:
echo   Development: http://localhost:8787/api/events
echo   Production:  https://envision-api.XXXXX.workers.dev/api/events
echo.
echo For detailed instructions:
echo   - See: CLOUDFLARE_D1_DEPLOYMENT_GUIDE.md
echo.
echo ============================================================
pause
