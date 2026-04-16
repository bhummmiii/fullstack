@echo off
REM Housing Society Hub - Production Deployment Checklist for Windows

echo 🏢 Housing Society Hub - Deployment Checklist (Windows)
echo =====================================================
echo.

REM Check Node version
echo 📦 Checking Node.js version...
for /f "tokens=*" %%i in ('node -v') do set node_version=%%i
echo    Node version: %node_version%
echo.

REM Check environment files
echo 🔐 Checking environment files...
if exist "server\.env.production" (
    echo    ✓ server\.env.production exists
) else (
    echo    ✗ server\.env.production missing
)

if exist "server\.env.render" (
    echo    ✓ server\.env.render exists
) else (
    echo    ✗ server\.env.render missing
)

if exist "client\.env.production" (
    echo    ✓ client\.env.production exists
) else (
    echo    ✗ client\.env.production missing
)
echo.

REM Check configuration files
echo ⚙️ Checking configuration files...
if exist "vercel.json" echo    ✓ vercel.json exists
if exist "render.yaml" echo    ✓ render.yaml exists
if exist "server\vercel.json" echo    ✓ server\vercel.json exists
if exist ".vercelignore" echo    ✓ .vercelignore exists
if exist ".renderignore" echo    ✓ .renderignore exists
echo.

REM Build test
echo 🏗️ Building frontend...
cd client
call npm run build
cd ..
echo.

echo ✅ Deployment checklist complete!
echo.
echo Next steps:
echo 1. Push changes to GitHub: git push origin main
echo 2. Deploy backend on Render
echo 3. Deploy frontend on Vercel
echo 4. Configure custom domains
echo 5. Monitor deployments
