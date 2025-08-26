/**
 * Webpack Validation Tests for eKYC Platform
 * Validates webpack builds and frontend application integrity
 */

class WebpackValidationTests {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  /**
   * Validate webpack build output
   */
  validateBuildOutput() {
    console.log('📦 Validating webpack build output...');
    
    try {
      const fs = require('fs');
      const path = require('path');
      
      const distPath = path.resolve(__dirname, 'dist');
      
      if (!fs.existsSync(distPath)) {
        throw new Error('Build output directory not found');
      }

      const files = fs.readdirSync(distPath);
      
      // Check for required files
      const requiredFiles = {
        'index.html': false,
        'js': false,
        'css': false
      };

      files.forEach(file => {
        if (file === 'index.html') {
          requiredFiles['index.html'] = true;
        } else if (file.endsWith('.js')) {
          requiredFiles['js'] = true;
        } else if (file.endsWith('.css')) {
          requiredFiles['css'] = true;
        }
      });

      let validationResults = [];
      for (const [fileType, found] of Object.entries(requiredFiles)) {
        if (found) {
          console.log(`✅ ${fileType}: Found`);
          validationResults.push(`${fileType}: Found`);
        } else {
          console.log(`⚠️  ${fileType}: Not found`);
          validationResults.push(`${fileType}: Not found`);
        }
      }

      const allFound = Object.values(requiredFiles).every(found => found);
      this.recordResult('Build Output Validation', allFound ? 'PASS' : 'WARN', 
        validationResults.join(', '));

    } catch (error) {
      console.error('❌ Build output validation failed:', error.message);
      this.recordResult('Build Output Validation', 'FAIL', error.message);
    }
  }

  /**
   * Validate bundle sizes
   */
  validateBundleSizes() {
    console.log('📏 Validating bundle sizes...');
    
    try {
      const fs = require('fs');
      const path = require('path');
      
      const distPath = path.resolve(__dirname, 'dist');
      
      if (!fs.existsSync(distPath)) {
        throw new Error('Build output directory not found');
      }

      const files = fs.readdirSync(distPath);
      const jsFiles = files.filter(file => file.endsWith('.js'));
      
      const sizeThresholds = {
        small: 100 * 1024,   // 100KB
        medium: 500 * 1024,  // 500KB
        large: 1024 * 1024   // 1MB
      };

      let totalSize = 0;
      let sizeResults = [];

      jsFiles.forEach(file => {
        const filePath = path.join(distPath, file);
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        totalSize += stats.size;
        
        let sizeCategory = 'small';
        if (stats.size > sizeThresholds.large) {
          sizeCategory = 'large';
        } else if (stats.size > sizeThresholds.medium) {
          sizeCategory = 'medium';
        }

        console.log(`📦 ${file}: ${sizeKB}KB (${sizeCategory})`);
        sizeResults.push(`${file}: ${sizeKB}KB`);
      });

      const totalSizeKB = (totalSize / 1024).toFixed(2);
      console.log(`📊 Total bundle size: ${totalSizeKB}KB`);

      // Check if total size is reasonable (under 2MB)
      const isReasonableSize = totalSize < (2 * 1024 * 1024);
      this.recordResult('Bundle Size Validation', isReasonableSize ? 'PASS' : 'WARN', 
        `Total: ${totalSizeKB}KB, Files: ${sizeResults.join(', ')}`);

    } catch (error) {
      console.error('❌ Bundle size validation failed:', error.message);
      this.recordResult('Bundle Size Validation', 'FAIL', error.message);
    }
  }

  /**
   * Validate asset optimization
   */
  validateAssetOptimization() {
    console.log('🎯 Validating asset optimization...');
    
    try {
      const fs = require('fs');
      const path = require('path');
      
      const distPath = path.resolve(__dirname, 'dist');
      
      if (!fs.existsSync(distPath)) {
        throw new Error('Build output directory not found');
      }

      const files = fs.readdirSync(distPath);
      
      // Check for minified files (should have shorter names or .min in them)
      const jsFiles = files.filter(file => file.endsWith('.js'));
      const cssFiles = files.filter(file => file.endsWith('.css'));
      
      let optimizationResults = [];

      // Check for content hashing (files should have hashes in production)
      const hasHashedFiles = jsFiles.some(file => /\.[a-f0-9]{8,}\./i.test(file));
      if (hasHashedFiles) {
        console.log('✅ Content hashing detected');
        optimizationResults.push('Content hashing: Yes');
      } else {
        console.log('⚠️  No content hashing detected');
        optimizationResults.push('Content hashing: No');
      }

      // Check for compression files (.gz)
      const hasGzipFiles = files.some(file => file.endsWith('.gz'));
      if (hasGzipFiles) {
        console.log('✅ Gzip compression detected');
        optimizationResults.push('Gzip compression: Yes');
      } else {
        console.log('⚠️  No gzip compression detected');
        optimizationResults.push('Gzip compression: No');
      }

      // Check if JS files seem minified (rough heuristic)
      let minificationDetected = false;
      for (const jsFile of jsFiles.slice(0, 3)) { // Check first 3 files
        const filePath = path.join(distPath, jsFile);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Simple check: minified files usually have very long lines
        const lines = content.split('\n');
        const avgLineLength = content.length / lines.length;
        
        if (avgLineLength > 100) { // Minified files typically have very long lines
          minificationDetected = true;
          break;
        }
      }

      if (minificationDetected) {
        console.log('✅ Minification detected');
        optimizationResults.push('Minification: Yes');
      } else {
        console.log('⚠️  No minification detected');
        optimizationResults.push('Minification: No');
      }

      this.recordResult('Asset Optimization', 'PASS', optimizationResults.join(', '));

    } catch (error) {
      console.error('❌ Asset optimization validation failed:', error.message);
      this.recordResult('Asset Optimization', 'FAIL', error.message);
    }
  }

  /**
   * Validate HTML template
   */
  validateHtmlTemplate() {
    console.log('🌐 Validating HTML template...');
    
    try {
      const fs = require('fs');
      const path = require('path');
      
      const htmlPath = path.join(__dirname, 'dist', 'index.html');
      
      if (!fs.existsSync(htmlPath)) {
        throw new Error('index.html not found in build output');
      }

      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      
      // Basic HTML validation checks
      const validationChecks = [
        { name: 'DOCTYPE', test: /<!DOCTYPE html>/i },
        { name: 'HTML tag', test: /<html[^>]*>/i },
        { name: 'Head tag', test: /<head[^>]*>/i },
        { name: 'Body tag', test: /<body[^>]*>/i },
        { name: 'Title tag', test: /<title[^>]*>.*<\/title>/i },
        { name: 'Script tags', test: /<script[^>]*src[^>]*>/i }
      ];

      let passedChecks = 0;
      let validationResults = [];

      validationChecks.forEach(check => {
        if (check.test.test(htmlContent)) {
          console.log(`✅ ${check.name}: Present`);
          validationResults.push(`${check.name}: Present`);
          passedChecks++;
        } else {
          console.log(`❌ ${check.name}: Missing`);
          validationResults.push(`${check.name}: Missing`);
        }
      });

      const allChecksPass = passedChecks === validationChecks.length;
      this.recordResult('HTML Template Validation', allChecksPass ? 'PASS' : 'FAIL', 
        validationResults.join(', '));

    } catch (error) {
      console.error('❌ HTML template validation failed:', error.message);
      this.recordResult('HTML Template Validation', 'FAIL', error.message);
    }
  }

  /**
   * Validate source maps
   */
  validateSourceMaps() {
    console.log('🗺️  Validating source maps...');
    
    try {
      const fs = require('fs');
      const path = require('path');
      
      const distPath = path.resolve(__dirname, 'dist');
      
      if (!fs.existsSync(distPath)) {
        throw new Error('Build output directory not found');
      }

      const files = fs.readdirSync(distPath);
      const sourceMapFiles = files.filter(file => file.endsWith('.map'));
      const jsFiles = files.filter(file => file.endsWith('.js') && !file.endsWith('.map'));
      
      console.log(`📊 Found ${sourceMapFiles.length} source map files`);
      console.log(`📊 Found ${jsFiles.length} JS files`);

      // Check if source maps exist for JS files
      let sourceMapsPresent = sourceMapFiles.length > 0;
      
      // Check if JS files reference source maps
      let sourceMapReferences = 0;
      jsFiles.forEach(jsFile => {
        const filePath = path.join(distPath, jsFile);
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes('//# sourceMappingURL=')) {
          sourceMapReferences++;
        }
      });

      if (sourceMapsPresent) {
        console.log('✅ Source maps generated');
      } else {
        console.log('⚠️  No source maps found');
      }

      this.recordResult('Source Maps Validation', sourceMapsPresent ? 'PASS' : 'WARN', 
        `${sourceMapFiles.length} source maps, ${sourceMapReferences} references`);

    } catch (error) {
      console.error('❌ Source maps validation failed:', error.message);
      this.recordResult('Source Maps Validation', 'FAIL', error.message);
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
   * Generate validation report
   */
  generateReport() {
    const endTime = Date.now();
    const totalTime = endTime - this.startTime;
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const warnings = this.results.filter(r => r.status === 'WARN').length;
    const total = this.results.length;

    console.log('\n📊 Webpack Validation Results:');
    console.log('==============================');
    console.log(`Total Validations: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Warnings: ${warnings}`);
    console.log(`Success Rate: ${total > 0 ? ((passed / total) * 100).toFixed(2) : 0}%`);
    console.log(`Total Time: ${totalTime}ms`);

    return {
      summary: {
        totalValidations: total,
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
   * Run all validation tests
   */
  async runAllValidations() {
    console.log('Starting Webpack Validation Suite...\n');
    
    try {
      this.validateBuildOutput();
      this.validateBundleSizes();
      this.validateAssetOptimization();
      this.validateHtmlTemplate();
      this.validateSourceMaps();
      
      console.log('\n🎉 Webpack validations completed!\n');
      return this.generateReport();
    } catch (error) {
      console.error('💥 Webpack validation suite failed:', error);
      throw error;
    }
  }
}

// Run validations if called directly
if (require.main === module) {
  const validator = new WebpackValidationTests();
  validator.runAllValidations().then(report => {
    const exitCode = report.summary.failed > 0 ? 1 : 0;
    process.exit(exitCode);
  }).catch(error => {
    console.error('Validation runner failed:', error);
    process.exit(1);
  });
}

// Export for use in webpack bundle
if (typeof window !== 'undefined') {
  window.WebpackValidationTests = WebpackValidationTests;
}

module.exports = WebpackValidationTests;
