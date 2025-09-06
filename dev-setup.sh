#!/bin/bash

# Development setup script
# This script helps set up the project for local development

echo "Setting up Talkie Gen AI for local development..."

# Check if GROQ_API_KEY environment variable is set
if [ -z "$GROQ_API_KEY" ]; then
    echo "Error: GROQ_API_KEY environment variable is not set"
    echo "Please set it with: export GROQ_API_KEY='your-api-key-here'"
    echo "Or create a .env file with GROQ_API_KEY=your-api-key-here"
    exit 1
fi

# Create development build directory
mkdir -p dev-build

# Copy all files except .git and node_modules
rsync -av --exclude='.git' --exclude='node_modules' --exclude='dev-build' --exclude='.github' . dev-build/

# Replace the placeholder with the environment variable
sed -i "s/{{GROQ_API_KEY}}/$GROQ_API_KEY/g" dev-build/script.js

echo "Development build created in dev-build/ directory"
echo "You can now serve the files from dev-build/ using any web server"
echo ""
echo "Example using Python:"
echo "  cd dev-build && python -m http.server 8000"
echo ""
echo "Example using Node.js:"
echo "  cd dev-build && npx serve ."
echo ""
echo "Then open http://localhost:8000 in your browser"