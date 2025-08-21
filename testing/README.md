# 🚀 eKYC Platform Testing Suite

A comprehensive testing framework for the eKYC (electronic Know Your Customer) platform. This suite provides extensive testing capabilities for backend Go microservices, frontend Webpack applications, integration testing, and performance validation.

## 🌟 Features

- **Backend Testing**: Comprehensive Go service testing with gRPC and MongoDB
- **Frontend Testing**: Webpack-based application testing with build validation and performance analysis
- **Integration Testing**: End-to-end workflow testing between services
- **Performance Testing**: Load testing, stress testing, and performance benchmarking
- **Multiple Output Formats**: JSON, HTML, and JUnit test reports
- **Configurable Environments**: Support for test, staging, and production
- **Command Line Interface**: Easy-to-use CLI with various testing options
- **Bundle Analysis**: Webpack bundle optimization and performance analysis
- **Containerization**: Podman-based containerized testing environment

## 📋 Prerequisites

- **Go 1.17+** for backend service testing
- **Node.js 14.0.0+** for frontend and test runner
- **MongoDB** for database testing
- **Podman** (optional) for containerized testing

## 🚀 Installation

1. Navigate to the testing directory:
```bash
cd testing
```

2. Install dependencies:
```bash
npm install
```

3. Verify installation:
```bash
npm run help
```

## 📖 Usage

### Basic Usage

Run all tests:
```bash
npm test
```

### Test Type Options

**Backend Tests Only:**
```bash
npm run test:backend
```

**Frontend Tests Only:**
```bash
npm run test:frontend
```

**Integration Tests Only:**
```bash
npm run test:integration
```

**Performance Tests Only:**
```bash
npm run test:performance
```

### Service-Specific Testing

**Test specific backend service:**
```bash
npm run test:customer      # Customer service
npm run test:identity      # Identity service
npm run test:kyc           # KYC certifier service
npm run test:user          # User service
npm run test:subscription  # Subscription service
```

**Test specific frontend app:**
```bash
npm run test:customer-web      # Customer web interface
npm run test:mfe-certifier     # KYC certifier interface
npm run test:org-web          # Organization management
npm run test:verification-web # Verification interface
npm run test:remitter-ux      # Self-service onboarding
npm run test:website          # Public website
```

### Webpack-Specific Testing

**Build and validate webpack bundles:**
```bash
npm run test:webpack
npm run test:build
npm run test:watch
```

### Command Line Options

```bash
node ekyc-test-runner.js [options]

Options:
  -t, --type <type>           Test type to run (all, backend, frontend, integration, performance)
  -s, --service <service>     Specific backend service to test
  -a, --app <app>             Specific frontend app to test
  --no-coverage               Disable coverage reporting
  -v, --verbose               Verbose output
  -h, --help                  Show help message
```

### Examples

Test specific service with verbose output:
```bash
node ekyc-test-runner.js --type backend --service customer --verbose
```

Test specific app without coverage:
```bash
node ekyc-test-runner.js --type frontend --app customer-web --no-coverage
```

Run integration tests only:
```bash
node ekyc-test-runner.js --type integration
```

## 🧪 Test Suites

### 1. Backend Tests (`--type backend`)
- **Customer Service**: Customer CRUD operations, risk assessment
- **Identity Service**: Document verification, biometric validation
- **KYC Certifier**: KYC workflow management, approval processes
- **User Service**: Authentication, authorization, role management
- **Subscription Service**: Billing, plan management, usage tracking

### 2. Frontend Tests (`--type frontend`)
- **Customer Web**: Webpack build validation, bundle optimization
- **MFE Certifier**: Module federation testing, chunk analysis
- **Organization Web**: Asset optimization, performance metrics
- **Verification Web**: Build integrity, source map validation
- **Remitter UX**: Bundle size analysis, compression testing
- **Website**: Static asset optimization, HTML template validation

### 3. Integration Tests (`--type integration`)
- **Customer Onboarding**: Complete customer registration flow
- **KYC Verification**: End-to-end KYC process
- **Identity Verification**: Document verification workflow
- **User Authentication**: Login/logout and session management
- **Service Communication**: Inter-service API calls

### 4. Performance Tests (`--type performance`)
- **API Response Time**: gRPC endpoint performance
- **Database Performance**: MongoDB query optimization
- **Frontend Performance**: Webpack bundle size and optimization
- **Build Performance**: Compilation time and efficiency
- **Asset Performance**: Load times and compression ratios

## 🌍 Environments

### Test Environment
- **Base URL**: `http://localhost:3000`
- **API Base URL**: `http://localhost:50051`
- **Database**: `mongodb://localhost:27017/ekyc_test`

### Staging Environment
- **Base URL**: `https://staging.ekyc.example.com`
- **API Base URL**: `https://api-staging.ekyc.example.com`
- **Database**: `mongodb://staging-db:27017/ekyc_staging`

### Production Environment
- **Base URL**: `https://ekyc.example.com`
- **API Base URL**: `https://api.ekyc.example.com`
- **Database**: `mongodb://prod-db:27017/ekyc_production`

## 📊 Output Formats

### Console Output
Default format with colored results and summary statistics.

### JSON Output
Detailed test results saved to `ekyc-test-report.json`.

### HTML Output
Beautiful HTML reports with styling and detailed results.

### Build Reports
- **Go**: `coverage.out` and `coverage.html`
- **Webpack**: Bundle analysis reports and build statistics
- **Performance**: Bundle size analysis and optimization reports

## ⚙️ Configuration

### Environment Variables

```bash
# Database configuration
MONGODB_URI=mongodb://localhost:27017/ekyc_test
MONGODB_USER=test_user
MONGODB_PASSWORD=test_password

# Service ports
CUSTOMER_SERVICE_PORT=50051
IDENTITY_SERVICE_PORT=50052
KYC_SERVICE_PORT=50053

# Test configuration
TEST_TIMEOUT=30000
TEST_COVERAGE=true
```

### Configuration File

Create `ekyc-test-config.json` for custom configurations:

```json
{
  "backend": {
    "services": ["customer", "identity", "kyc-certifier"],
    "testTimeout": 30000,
    "coverage": true
  },
  "frontend": {
    "apps": ["customer-web", "mfe-certifier"],
    "testTimeout": 30000,
    "coverage": true
  }
}
```

## 📈 Performance Metrics

The performance testing suite provides:

- **Response Time**: P50, P95, P99 percentiles
- **Throughput**: Requests per second
- **Concurrency**: Maximum concurrent users supported
- **Error Rates**: Success/failure percentages
- **Resource Utilization**: Memory and CPU usage patterns

## 🚨 Error Handling

The suite tests various error scenarios:

- **Invalid Data**: Malformed requests and responses
- **Service Failures**: Unavailable services and timeouts
- **Database Errors**: Connection failures and query errors
- **Authentication Failures**: Invalid credentials and expired tokens
- **Rate Limiting**: API throttling and quota exceeded

## 🔧 Customization

### Adding New Tests

1. Create a new test file following the naming convention
2. Implement required test methods
3. Add to the appropriate test suite
4. Update configuration files

### Custom Test Suites

Modify `ekyc-test-config.json` to add new test suites:

```json
{
  "testSuites": {
    "custom": {
      "description": "Custom test suite",
      "tests": ["backend:customer", "frontend:customer-web"],
      "timeout": 30000
    }
  }
}
```

## 🐳 Podman Support

Run tests in a container using Podman:

```bash
# Build test container
npm run container:build

# Run all tests
npm run container:test

# Run specific test types
npm run container:run -- --type backend

# Interactive development
podman run -it --rm -v $(pwd):/workspace -w /workspace ekyc-testing bash

# Clean up containers
npm run container:clean
```

## 📝 Logging

The suite provides comprehensive logging:

- **Test Execution**: Progress and status updates
- **Performance Metrics**: Response times and throughput
- **Error Details**: Failure reasons and stack traces
- **Coverage Information**: Code coverage statistics
- **Timing Information**: Test duration and execution time

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Documentation**: This README and inline code comments
- **Issues**: GitHub Issues for bug reports and feature requests
- **Team**: Contact the eKYC platform development team

## 🔮 Future Enhancements

- **GraphQL Testing**: Support for GraphQL endpoints
- **WebSocket Testing**: Real-time communication testing
- **Mobile App Testing**: React Native and mobile-specific tests
- **Security Testing**: Vulnerability scanning and penetration testing
- **Compliance Testing**: Regulatory and standards compliance
- **AI/ML Testing**: Machine learning model validation

## 🎯 Use Cases

- **Development**: Test services during development
- **Quality Assurance**: Ensure platform reliability and performance
- **Continuous Integration**: Automated testing in CI/CD pipelines
- **Monitoring**: Continuous monitoring of platform health
- **Compliance**: Validate regulatory requirements
- **Performance**: Benchmark and optimize system performance

## 🚀 Quick Start Examples

### Run Smoke Tests
```bash
npm run test:smoke
```

### Test Customer Service
```bash
npm run test:customer
```

### Test Customer Web App
```bash
npm run test:customer-web
```

### Run All Tests with Coverage
```bash
npm test
```

### Run Performance Tests
```bash
npm run test:performance
```

### Clean Test Artifacts
```bash
npm run clean
```

---

**Happy Testing! 🚀✨**
