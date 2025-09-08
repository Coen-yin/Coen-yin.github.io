#!/bin/bash

# Appwrite Setup Helper Script
# This script helps verify and set up the Appwrite configuration

echo "🚀 Talkie Gen AI - Appwrite Setup Helper"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "script.js" ]; then
    echo "❌ Error: script.js not found. Please run this from the project root directory."
    exit 1
fi

echo "✅ Found script.js"

# Extract current configuration
PROJECT_ID=$(grep "const APPWRITE_PROJECT_ID" script.js | head -1 | sed "s/.*'\(.*\)'.*/\1/")
ENDPOINT=$(grep "const APPWRITE_ENDPOINT" script.js | head -1 | sed "s/.*'\(.*\)'.*/\1/")

echo ""
echo "📋 Current Appwrite Configuration:"
echo "   Project ID: $PROJECT_ID"
echo "   Endpoint: $ENDPOINT"
echo ""

# Get current domain
if [ -f "CNAME" ]; then
    DOMAIN=$(cat CNAME)
    echo "🌐 Detected domain: https://$DOMAIN"
else
    echo "🌐 Default domain: https://coen-yin.github.io"
    DOMAIN="coen-yin.github.io"
fi

echo ""
echo "📝 Appwrite Setup Checklist:"
echo ""
echo "1. 🔗 Go to: https://cloud.appwrite.io"
echo "2. ➕ Create new project with ID: $PROJECT_ID"
echo "3. 🌐 Add platform domains:"
echo "   - https://$DOMAIN"
echo "   - http://localhost:8001"
echo "4. 🗄️  Create database: main-database"
echo "5. 📊 Create collections (see QUICK_APPWRITE_SETUP.md for details):"
echo "   - users"
echo "   - user_data"
echo "6. 🔐 Enable Email/Password authentication"
echo ""

echo "🔍 Testing URLs:"
echo "   Local: http://localhost:8001"
echo "   Production: https://$DOMAIN"
echo ""

echo "🧪 After setup, test with:"
echo "   1. Open browser console"
echo "   2. Run: verifyAppwriteSetup()"
echo "   3. Look for: '🌟 Appwrite connection successful'"
echo ""

echo "📚 For detailed instructions, see:"
echo "   - QUICK_APPWRITE_SETUP.md"
echo "   - APPWRITE_SETUP.md"
echo ""

echo "✨ Setup helper complete!"