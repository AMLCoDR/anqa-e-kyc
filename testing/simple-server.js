#!/usr/bin/env node

/**
 * Simple HTTP Server for eKYC Testing Suite
 * Deploys the testing interface on localhost:3200
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3200;
const BASE_DIR = __dirname;

// MIME types for different file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
};

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Default to demo app for root path
  if (pathname === '/') {
    pathname = '/demo-app.html';
  }
  
  // Security: prevent directory traversal
  if (pathname.includes('..')) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }
  
  const filePath = path.join(BASE_DIR, pathname);
  const ext = path.extname(filePath);
  const mimeType = mimeTypes[ext] || 'application/octet-stream';
  
  // Handle different routes
  if (pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      port: PORT
    }));
    return;
  }
  
  if (pathname === '/api/tests') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      tests: [
        { name: 'Webpack Tests', status: 'ready', description: 'Webpack configuration and build validation' },
        { name: 'Bundle Analysis', status: 'ready', description: 'Bundle size and optimization analysis' },
        { name: 'Frontend Validation', status: 'ready', description: 'Frontend application build testing' },
        { name: 'Performance Tests', status: 'ready', description: 'Performance and load testing' }
      ]
    }));
    return;
  }
  
  // Serve static files
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found, serve 404
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head><title>404 - Not Found</title></head>
          <body>
            <h1>404 - Page Not Found</h1>
            <p>The requested resource was not found.</p>
            <a href="/">Go back to home</a>
          </body>
          </html>
        `);
      } else {
        // Server error
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
      return;
    }
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Serve the file
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log('eKYC Platform Demo Server Started!');
  console.log('📱 Access your demo application at: http://localhost:3200');
  console.log('🔧 API endpoints:');
  console.log('   - GET /api/status - Server status');
  console.log('   - GET /api/tests - Available tests');
  console.log('⏹️  Press Ctrl+C to stop the server');
  console.log('');
  console.log('📊 Server Information:');
  console.log(`   Port: ${PORT}`);
  console.log(`   Base Directory: ${BASE_DIR}`);
  console.log(`   Node.js Version: ${process.version}`);
  console.log(`   Platform: ${process.platform}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped gracefully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  server.close(() => {
    console.log('✅ Server stopped gracefully');
    process.exit(0);
  });
});

// Error handling
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.error('Please stop the service using this port or use a different port');
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});
