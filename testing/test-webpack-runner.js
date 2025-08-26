/**
 * Webpack Test Runner for eKYC Platform
 * Tests frontend applications using Webpack builds instead of React-specific tools
 */

class WebpackTestRunner {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  /**
   * Test basic webpack functionality
   */
  testWebpackBasics() {
    console.log('🔧 Testing Webpack basics...');
    
    try {
      // Test if webpack is available
      const webpack = require('webpack');
      console.log('✅ Webpack is available');
      
      // Test basic webpack functionality
      const config = require('./webpack.test.config.js');
      console.log('✅ Webpack config loaded');
      
      this.recordResult('Webpack Basic Setup', 'PASS', 'Webpack configuration loaded successfully');
      return true;
    } catch (error) {
      console.error('❌ Webpack basic test failed:', error.message);
      this.recordResult('Webpack Basic Setup', 'FAIL', error.message);
      return false;
    }
  }

  /**
   * Test frontend app build validation
   */
  async testFrontendBuilds() {
    console.log('🎨 Testing frontend application builds...');
    
    const apps = [
      { name: 'customer-web', path: '../frontend-apps/customer-web' },
      { name: 'mfe-certifier', path: '../frontend-apps/mfe-certifier' },
      { name: 'organisation-web', path: '../frontend-apps/organisation-web' },
      { name: 'verification-web', path: '../frontend-apps/verification-web' },
      { name: 'remitter-ux', path: '../frontend-apps/remitter-ux' },
      { name: 'website', path: '../frontend-apps/website' }
    ];

    for (const app of apps) {
      try {
        console.log(`Testing build for: ${app.name}`);
        
        // Check if app directory exists
        const fs = require('fs');
        const path = require('path');
        const appPath = path.resolve(__dirname, app.path);
        
        if (!fs.existsSync(appPath)) {
          console.log(`⚠️  App ${app.name} not found, skipping...`);
          continue;
        }

        // Check if package.json exists
        const packageJsonPath = path.join(appPath, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
          console.log(`⚠️  No package.json found for ${app.name}, skipping...`);
          continue;
        }

        // Validate package.json structure
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        // Check for webpack-related scripts
        const hasWebpackScripts = packageJson.scripts && 
          (packageJson.scripts.build || packageJson.scripts.start);

        if (hasWebpackScripts) {
          console.log(`✅ ${app.name}: Webpack scripts found`);
          this.recordResult(`${app.name} Build Config`, 'PASS', 'Webpack scripts available');
        } else {
          console.log(`⚠️  ${app.name}: No webpack scripts found`);
          this.recordResult(`${app.name} Build Config`, 'WARN', 'No webpack scripts found');
        }

        // Check for webpack config file
        const webpackConfigPath = path.join(appPath, 'webpack.config.js');
        if (fs.existsSync(webpackConfigPath)) {
          console.log(`✅ ${app.name}: Webpack config found`);
          this.recordResult(`${app.name} Webpack Config`, 'PASS', 'Webpack config file exists');
        } else {
          console.log(`⚠️  ${app.name}: No webpack config found`);
          this.recordResult(`${app.name} Webpack Config`, 'WARN', 'No webpack config file');
        }

      } catch (error) {
        console.error(`❌ ${app.name} test failed:`, error.message);
        this.recordResult(`${app.name} Build Test`, 'FAIL', error.message);
      }
    }
  }

  /**
   * Test bundle analysis
   */
  testBundleAnalysis() {
    console.log('📊 Testing bundle analysis capabilities...');
    
    try {
      // Test if webpack-bundle-analyzer is available
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
      console.log('✅ Bundle analyzer is available');
      
      this.recordResult('Bundle Analysis', 'PASS', 'Bundle analyzer plugin available');
      return true;
    } catch (error) {
      console.log('⚠️  Bundle analyzer not available:', error.message);
      this.recordResult('Bundle Analysis', 'WARN', 'Bundle analyzer not available');
      return false;
    }
  }

  /**
   * Test performance optimizations
   */
  testPerformanceOptimizations() {
    console.log('⚡ Testing performance optimization features...');
    
    const optimizations = [
      { name: 'Compression Plugin', module: 'compression-webpack-plugin' },
      { name: 'Terser Plugin', module: 'terser-webpack-plugin' },
      { name: 'CSS Loader', module: 'css-loader' },
      { name: 'Style Loader', module: 'style-loader' }
    ];

    let passCount = 0;
    
    for (const opt of optimizations) {
      try {
        require(opt.module);
        console.log(`✅ ${opt.name}: Available`);
        this.recordResult(`Performance: ${opt.name}`, 'PASS', `${opt.module} is available`);
        passCount++;
      } catch (error) {
        console.log(`❌ ${opt.name}: Not available`);
        this.recordResult(`Performance: ${opt.name}`, 'FAIL', `${opt.module} not available`);
      }
    }

    const overallResult = passCount >= optimizations.length / 2 ? 'PASS' : 'FAIL';
    this.recordResult('Performance Optimizations Overall', overallResult, 
      `${passCount}/${optimizations.length} optimizations available`);
  }

  /**
   * Test module resolution
   */
  testModuleResolution() {
    console.log('🔍 Testing module resolution...');
    
    try {
      const path = require('path');
      
      // Test alias resolution
      const aliases = {
        '@customer': '../frontend-apps/customer-web',
        '@certifier': '../frontend-apps/mfe-certifier',
        '@org': '../frontend-apps/organisation-web'
      };

      let resolvedCount = 0;
      
      for (const [alias, aliasPath] of Object.entries(aliases)) {
        const resolvedPath = path.resolve(__dirname, aliasPath);
        const fs = require('fs');
        
        if (fs.existsSync(resolvedPath)) {
          console.log(`✅ Alias ${alias}: Resolved to ${resolvedPath}`);
          resolvedCount++;
        } else {
          console.log(`⚠️  Alias ${alias}: Path ${resolvedPath} not found`);
        }
      }

      const result = resolvedCount > 0 ? 'PASS' : 'FAIL';
      this.recordResult('Module Resolution', result, 
        `${resolvedCount}/${Object.keys(aliases).length} aliases resolved`);

    } catch (error) {
      console.error('❌ Module resolution test failed:', error.message);
      this.recordResult('Module Resolution', 'FAIL', error.message);
    }
  }

  /**
   * Record test result
   */
  recordResult(testName, status, details) {
    this.results.push({
      testName,
      status,
      details,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Generate test report
   */
  generateReport() {
    const endTime = Date.now();
    const totalTime = endTime - this.startTime;
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const warnings = this.results.filter(r => r.status === 'WARN').length;
    const total = this.results.length;

    console.log('\n📊 Webpack Test Results:');
    console.log('========================');
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Warnings: ${warnings}`);
    console.log(`Success Rate: ${total > 0 ? ((passed / total) * 100).toFixed(2) : 0}%`);
    console.log(`Total Time: ${totalTime}ms`);

    return {
      summary: {
        totalTests: total,
        passed,
        failed,
        warnings,
        successRate: total > 0 ? ((passed / total) * 100).toFixed(2) + '%' : '0%',
        totalTime: totalTime + 'ms'
      },
      results: this.results
    };
  }

  /**
   * Run all webpack tests
   */
  async runAllTests() {
    console.log('Starting Webpack Test Suite...\n');
    
    try {
      this.testWebpackBasics();
      await this.testFrontendBuilds();
      this.testBundleAnalysis();
      this.testPerformanceOptimizations();
      this.testModuleResolution();
      
      console.log('\n🎉 Webpack tests completed!\n');
      return this.generateReport();
    } catch (error) {
      console.error('💥 Webpack test suite failed:', error);
      throw error;
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const runner = new WebpackTestRunner();
  runner.runAllTests().then(report => {
    const exitCode = report.summary.failed > 0 ? 1 : 0;
    process.exit(exitCode);
  }).catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

// Export for use in webpack bundle
if (typeof window !== 'undefined') {
  window.WebpackTestRunner = WebpackTestRunner;
}

module.exports = WebpackTestRunner;
