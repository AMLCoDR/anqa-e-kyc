#!/bin/bash

# eKYC Testing Suite - Local Deployment Script
# Deploys the testing suite on localhost:3200

echo "🚀 Deploying eKYC Testing Suite on localhost:3200..."

# Check if webpack is available
if ! command -v webpack &> /dev/null; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the webpack bundle
echo "🔨 Building webpack bundle..."
npm run test:webpack

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Start the development server
    echo "🌐 Starting development server on port 3200..."
    echo "📱 Access your testing suite at: http://localhost:3200"
    echo "⏹️  Press Ctrl+C to stop the server"
    
    # Start webpack dev server
    npm run serve:local
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
