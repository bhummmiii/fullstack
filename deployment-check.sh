#!/bin/bash

# Housing Society Hub - Production Deployment Checklist

echo "🏢 Housing Society Hub - Deployment Checklist"
echo "=============================================="
echo ""

# Check Node version
echo "📦 Checking Node.js version..."
node_version=$(node -v)
echo "   Node version: $node_version"
echo ""

# Check environment files
echo "🔐 Checking environment files..."
if [ -f "server/.env.production" ]; then
    echo "   ✓ server/.env.production exists"
else
    echo "   ✗ server/.env.production missing"
fi

if [ -f "server/.env.render" ]; then
    echo "   ✓ server/.env.render exists"
else
    echo "   ✗ server/.env.render missing"
fi

if [ -f "client/.env.production" ]; then
    echo "   ✓ client/.env.production exists"
else
    echo "   ✗ client/.env.production missing"
fi
echo ""

# Check configuration files
echo "⚙️ Checking configuration files..."
files=("vercel.json" "render.yaml" "server/vercel.json" ".vercelignore" ".renderignore")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✓ $file exists"
    else
        echo "   ✗ $file missing"
    fi
done
echo ""

# Check dependencies
echo "📚 Checking dependencies..."
echo "   Frontend dependencies:"
cd client && npm list --depth=0 2>/dev/null | head -5
cd ..
echo "   Backend dependencies:"
cd server && npm list --depth=0 2>/dev/null | head -5
cd ..
echo ""

# Build test
echo "🏗️ Building frontend..."
cd client
npm run build 2>&1 | tail -5
cd ..
echo ""

echo "✅ Deployment checklist complete!"
echo ""
echo "Next steps:"
echo "1. Push changes to GitHub: git push origin main"
echo "2. Deploy backend on Render"
echo "3. Deploy frontend on Vercel"
echo "4. Configure custom domains"
echo "5. Monitor deployments"
