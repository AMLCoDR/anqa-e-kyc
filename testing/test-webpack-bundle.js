/**
 * Webpack Bundle Test Runner
 * Tests the generated webpack bundles for functionality and performance
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class WebpackBundleTestRunner {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
    this.distPath = path.resolve(__dirname, 'dist');
  }

  /**
   * Test if webpack build was successful
   */
  testBuildSuccess() {
    console.log('🔍 Testing webpack build success...');
    
    try {
      if (!fs.existsSync(this.distPath)) {
        throw new Error('Build output directory not found');
      }

      const files = fs.readdirSync(this.distPath);
      const hasJsFiles = files.some(file => file.endsWith('.js'));
      const hasHtmlFile = files.includes('index.html');

      if (hasJsFiles && hasHtmlFile) {
        console.log('✅ Webpack build successful');
        this.recordResult('Build Success', 'PASS', `Found ${files.length} output files`);
        return true;
      } else {
        throw new Error('Missing expected output files');
      }

    } catch (error) {
      console.error('❌ Webpack build test failed:', error.message);
      this.recordResult('Build Success', 'FAIL', error.message);
      return false;
    }
  }

  /**
   * Test bundle execution
   */
  testBundleExecution() {
    console.log('⚡ Testing bundle execution...');
    
    try {
      const files = fs.readdirSync(this.distPath);
      const jsFiles = files.filter(file => file.endsWith('.js') && !file.endsWith('.map'));
      
      let executionResults = [];
      
      for (const jsFile of jsFiles.slice(0, 3)) { // Test first 3 JS files
        try {
          const filePath = path.join(this.distPath, jsFile);
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Basic syntax validation - try to parse as JS
          try {
            // Use VM to validate syntax without executing
            const vm = require('vm');
            const script = new vm.Script(content, { filename: jsFile });
            
            console.log(`✅ ${jsFile}: Valid JavaScript syntax`);
            executionResults.push(`${jsFile}: Valid`);
          } catch (syntaxError) {
            console.log(`❌ ${jsFile}: Syntax error - ${syntaxError.message}`);
            executionResults.push(`${jsFile}: Syntax error`);
          }
          
        } catch (error) {
          console.log(`❌ ${jsFile}: Cannot read file - ${error.message}`);
          executionResults.push(`${jsFile}: Read error`);
        }
      }

      const validFiles = executionResults.filter(result => result.includes('Valid')).length;
      const totalFiles = executionResults.length;
      
      const isSuccess = validFiles === totalFiles;
      this.recordResult('Bundle Execution', isSuccess ? 'PASS' : 'FAIL', 
        `${validFiles}/${totalFiles} files valid: ${executionResults.join(', ')}`);

      return isSuccess;

    } catch (error) {
      console.error('❌ Bundle execution test failed:', error.message);
      this.recordResult('Bundle Execution', 'FAIL', error.message);
      return false;
    }
  }

  /**
   * Test HTML template integration
   */
  testHtmlIntegration() {
    console.log('🌐 Testing HTML template integration...');
    
    try {
      const htmlPath = path.join(this.distPath, 'index.html');
      
      if (!fs.existsSync(htmlPath)) {
        throw new Error('index.html not found');
      }

      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      
      // Check for script tag injection
      const scriptTags = (htmlContent.match(/<script[^>]*src[^>]*>/g) || []).length;
      const hasTitle = /<title[^>]*>.*<\/title>/i.test(htmlContent);
      const hasMetaTags = /<meta[^>]*>/g.test(htmlContent);
      
      console.log(`📊 Found ${scriptTags} script tags`);
      console.log(`📊 Title tag: ${hasTitle ? 'Present' : 'Missing'}`);
      console.log(`📊 Meta tags: ${hasMetaTags ? 'Present' : 'Missing'}`);

      const integrationScore = [scriptTags > 0, hasTitle, hasMetaTags].filter(Boolean).length;
      const isSuccess = integrationScore >= 2; // At least 2 out of 3 checks pass

      this.recordResult('HTML Integration', isSuccess ? 'PASS' : 'FAIL', 
        `${integrationScore}/3 integration checks passed`);

      return isSuccess;

    } catch (error) {
      console.error('❌ HTML integration test failed:', error.message);
      this.recordResult('HTML Integration', 'FAIL', error.message);
      return false;
    }
  }

  /**
   * Test asset loading
   */
  testAssetLoading() {
    console.log('📦 Testing asset loading...');
    
    try {
      const files = fs.readdirSync(this.distPath);
      
      const assetTypes = {
        js: files.filter(f => f.endsWith('.js')).length,
        css: files.filter(f => f.endsWith('.css')).length,
        html: files.filter(f => f.endsWith('.html')).length,
        images: files.filter(f => /\.(png|jpe?g|gif|svg)$/i.test(f)).length,
        fonts: files.filter(f => /\.(woff2?|eot|ttf)$/i.test(f)).length,
        maps: files.filter(f => f.endsWith('.map')).length
      };

      console.log('📊 Asset breakdown:');
      Object.entries(assetTypes).forEach(([type, count]) => {
        console.log(`   ${type}: ${count} files`);
      });

      const totalAssets = Object.values(assetTypes).reduce((sum, count) => sum + count, 0);
      const hasMinimumAssets = assetTypes.js > 0 && assetTypes.html > 0;

      this.recordResult('Asset Loading', hasMinimumAssets ? 'PASS' : 'FAIL', 
        `${totalAssets} total assets: JS:${assetTypes.js}, CSS:${assetTypes.css}, HTML:${assetTypes.html}`);

      return hasMinimumAssets;

    } catch (error) {
      console.error('❌ Asset loading test failed:', error.message);
      this.recordResult('Asset Loading', 'FAIL', error.message);
      return false;
    }
  }

  /**
   * Test bundle performance characteristics
   */
  testBundlePerformance() {
    console.log('⚡ Testing bundle performance...');
    
    try {
      const files = fs.readdirSync(this.distPath);
      const jsFiles = files.filter(file => file.endsWith('.js') && !file.endsWith('.map'));
      
      let totalSize = 0;
      let performanceResults = [];
      
      jsFiles.forEach(file => {
        const filePath = path.join(this.distPath, file);
        const stats = fs.statSync(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        totalSize += stats.size;
        
        let performance = 'good';
        if (sizeKB > 1000) {
          performance = 'poor';
        } else if (sizeKB > 500) {
          performance = 'fair';
        }
        
        console.log(`📦 ${file}: ${sizeKB}KB (${performance})`);
        performanceResults.push(`${file}:${sizeKB}KB`);
      });

      const totalSizeKB = Math.round(totalSize / 1024);
      const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
      
      console.log(`📊 Total bundle size: ${totalSizeKB}KB (${totalSizeMB}MB)`);

      // Performance thresholds
      const isOptimal = totalSize < (500 * 1024);    // Under 500KB
      const isAcceptable = totalSize < (2 * 1024 * 1024); // Under 2MB
      
      let performanceRating = 'poor';
      if (isOptimal) {
        performanceRating = 'optimal';
      } else if (isAcceptable) {
        performanceRating = 'acceptable';
      }

      this.recordResult('Bundle Performance', isAcceptable ? 'PASS' : 'WARN', 
        `${totalSizeKB}KB total (${performanceRating}): ${performanceResults.join(', ')}`);

      return isAcceptable;

    } catch (error) {
      console.error('❌ Bundle performance test failed:', error.message);
      this.recordResult('Bundle Performance', 'FAIL', error.message);
      return false;
    }
  }

  /**
   * Test webpack configuration validation
   */
  testWebpackConfig() {
    console.log('⚙️  Testing webpack configuration...');
    
    try {
      const configPath = path.resolve(__dirname, 'webpack.test.config.js');
      
      if (!fs.existsSync(configPath)) {
        throw new Error('webpack.test.config.js not found');
      }

      // Load and validate config
      const config = require(configPath);
      const configResult = typeof config === 'function' ? config() : config;
      
      const validationChecks = [
        { name: 'Entry points', test: () => configResult.entry !== undefined },
        { name: 'Output config', test: () => configResult.output !== undefined },
        { name: 'Module rules', test: () => configResult.module && configResult.module.rules },
        { name: 'Plugins array', test: () => Array.isArray(configResult.plugins) },
        { name: 'Resolve config', test: () => configResult.resolve !== undefined }
      ];

      let passedChecks = 0;
      let configResults = [];

      validationChecks.forEach(check => {
        try {
          if (check.test()) {
            console.log(`✅ ${check.name}: Valid`);
            configResults.push(`${check.name}: Valid`);
            passedChecks++;
          } else {
            console.log(`❌ ${check.name}: Invalid`);
            configResults.push(`${check.name}: Invalid`);
          }
        } catch (error) {
          console.log(`❌ ${check.name}: Error - ${error.message}`);
          configResults.push(`${check.name}: Error`);
        }
      });

      const isValidConfig = passedChecks >= (validationChecks.length * 0.8); // 80% pass rate
      this.recordResult('Webpack Config', isValidConfig ? 'PASS' : 'FAIL', 
        `${passedChecks}/${validationChecks.length} checks passed`);

      return isValidConfig;

    } catch (error) {
      console.error('❌ Webpack config test failed:', error.message);
      this.recordResult('Webpack Config', 'FAIL', error.message);
      return false;
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

    console.log('\n📊 Webpack Bundle Test Results:');
    console.log('================================');
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Warnings: ${warnings}`);
    console.log(`Success Rate: ${total > 0 ? ((passed / total) * 100).toFixed(2) : 0}%`);
    console.log(`Total Time: ${totalTime}ms`);

    // Save detailed report
    const report = {
      summary: {
        totalTests: total,
        passed,
        failed,
        warnings,
        successRate: total > 0 ? ((passed / total) * 100).toFixed(2) + '%' : '0%',
        totalTime: totalTime + 'ms',
        timestamp: new Date().toISOString()
      },
      results: this.results
    };

    try {
      fs.writeFileSync(
        path.join(__dirname, 'webpack-bundle-test-report.json'), 
        JSON.stringify(report, null, 2)
      );
      console.log('\n📄 Detailed report saved to: webpack-bundle-test-report.json');
    } catch (error) {
      console.warn('⚠️  Could not save report file:', error.message);
    }

    return report;
  }

  /**
   * Run all bundle tests
   */
  async runAllTests() {
    console.log('🚀 Starting Webpack Bundle Test Suite...\n');
    
    try {
      this.testBuildSuccess();
      this.testWebpackConfig();
      this.testBundleExecution();
      this.testHtmlIntegration();
      this.testAssetLoading();
      this.testBundlePerformance();
      
      console.log('\n🎉 Webpack bundle tests completed!\n');
      return this.generateReport();
    } catch (error) {
      console.error('💥 Webpack bundle test suite failed:', error);
      throw error;
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const runner = new WebpackBundleTestRunner();
  runner.runAllTests().then(report => {
    const exitCode = report.summary.failed > 0 ? 1 : 0;
    process.exit(exitCode);
  }).catch(error => {
    console.error('Bundle test runner failed:', error);
    process.exit(1);
  });
}

module.exports = WebpackBundleTestRunner;
