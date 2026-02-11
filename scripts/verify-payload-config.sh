#!/usr/bin/env bash
# Verification script to check if Payload CMS configuration is working

set -e

echo "🔍 Payload CMS Configuration Verification"
echo "=========================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "   Create .env.local with PAYLOAD_API_URL and PAYLOAD_API_KEY"
    exit 1
fi

# Source environment variables
set -a
source .env.local
set +a

# Check if required variables are set
if [ -z "$PAYLOAD_API_URL" ]; then
    echo "❌ PAYLOAD_API_URL is not set in .env.local"
    exit 1
fi

if [ -z "$PAYLOAD_API_KEY" ]; then
    echo "❌ PAYLOAD_API_KEY is not set in .env.local"
    exit 1
fi

echo "✅ Environment variables configured"
echo "   PAYLOAD_API_URL: $PAYLOAD_API_URL"
echo "   PAYLOAD_API_KEY: ${PAYLOAD_API_KEY:0:10}..." # Show only first 10 chars
echo ""

# Test API connectivity
echo "📡 Testing API connectivity..."
echo ""

# Test Hikayeler collection
echo "1️⃣ Testing Hikayeler collection..."
HIKAYELER_RESPONSE=$(curl -s -w "\n%{http_code}" \
    -H "Authorization: Bearer $PAYLOAD_API_KEY" \
    "$PAYLOAD_API_URL/hikayeler?limit=1&locale=tr&draft=false")

HIKAYELER_CODE=$(echo "$HIKAYELER_RESPONSE" | tail -n1)
HIKAYELER_BODY=$(echo "$HIKAYELER_RESPONSE" | sed '$d')

if [ "$HIKAYELER_CODE" = "200" ]; then
    HIKAYELER_COUNT=$(echo "$HIKAYELER_BODY" | grep -o '"totalDocs":[0-9]*' | grep -o '[0-9]*')
    echo "   ✅ Hikayeler API working (${HIKAYELER_COUNT} total articles)"
else
    echo "   ❌ Hikayeler API failed (HTTP $HIKAYELER_CODE)"
    echo "   Response: $HIKAYELER_BODY"
    exit 1
fi

# Test Gündem collection
echo "2️⃣ Testing Gündem collection..."
GUNDEM_RESPONSE=$(curl -s -w "\n%{http_code}" \
    -H "Authorization: Bearer $PAYLOAD_API_KEY" \
    "$PAYLOAD_API_URL/gundem?limit=1&locale=tr&draft=false")

GUNDEM_CODE=$(echo "$GUNDEM_RESPONSE" | tail -n1)
GUNDEM_BODY=$(echo "$GUNDEM_RESPONSE" | sed '$d')

if [ "$GUNDEM_CODE" = "200" ]; then
    GUNDEM_COUNT=$(echo "$GUNDEM_BODY" | grep -o '"totalDocs":[0-9]*' | grep -o '[0-9]*')
    echo "   ✅ Gündem API working (${GUNDEM_COUNT} total articles)"
else
    echo "   ❌ Gündem API failed (HTTP $GUNDEM_CODE)"
    echo "   Response: $GUNDEM_BODY"
    exit 1
fi

echo ""
echo "✅ All checks passed!"
echo ""
echo "📋 Next steps:"
echo "   1. Start dev server: npm run dev"
echo "   2. Visit http://localhost:3000"
echo "   3. Verify articles appear on homepage"
echo ""
echo "🚀 For production deployment:"
echo "   1. Set environment variables in Vercel/Netlify"
echo "   2. Deploy the application"
echo "   3. Visit https://next.scrolli.co"
echo "   4. Verify articles appear"
