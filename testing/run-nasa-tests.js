#!/usr/bin/env node

const NASATestingSuite = require('./nasa-testing-suite');

/**
 * NASA Test Runner
 * Simple script to run the NASA testing suite
 */

async function main() {
  console.log('NASA Testing Suite Runner\n');
  
  // Configuration
  const config = {
    baseURL: process.env.NASA_BASE_URL || 'https://api.nasa.gov',
    apiKey: process.env.NASA_API_KEY,
    timeout: parseInt(process.env.NASA_TIMEOUT) || 30000
  };

  // Check if API key is provided
  if (!config.apiKey) {
    console.log('⚠️  Warning: No NASA API key provided. Set NASA_API_KEY environment variable.');
    console.log('   Some tests may fail due to rate limiting.\n');
  }

  try {
    // Create and run test suite
    const testSuite = new NASATestingSuite(config);
    const report = await testSuite.runAllTests();
    
    // Exit with appropriate code
    const exitCode = report.summary.failed > 0 ? 1 : 0;
    process.exit(exitCode);
    
  } catch (error) {
    console.error('💥 Test runner failed:', error.message);
    process.exit(1);
  }
}

// Handle command line arguments
if (require.main === module) {
  main();
}

module.exports = { main };
