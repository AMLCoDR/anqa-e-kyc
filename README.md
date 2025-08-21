# Anqa eKYC 2025 - Complete Platform Migration

## Overview

This directory contains the complete migrated eKYC 2025 platform from the Anqa 2021 workspace. The platform is a comprehensive electronic Know Your Customer (KYC) and identity verification system designed for financial institutions and regulated entities.

## Migration Summary

**Migration Date**: August 21, 2024  
**Source**: Anqa 2021 workspace  
**Status**: Complete migration of all eKYC-related components  

## Directory Structure

```
anqa-e-kyc/
├── backend-services/          # 12 Go microservices
│   ├── kyc-certifier/        # KYC certification & verification orchestration
│   ├── id-verifier/          # Document & identity verification processing
│   ├── id-check/             # Real-time identity document checking
│   ├── identity/             # Central identity lifecycle management
│   ├── customer/             # Customer lifecycle management
│   ├── customer-v1/          # Customer service v1
│   ├── user/                 # User account & tenant management
│   ├── subscription/         # Billing & subscription management
│   ├── reporting-entity/     # Organization & reporting entity management
│   ├── key-person/           # Key person identification & risk assessment
│   ├── vc-issuer/           # Digital identity credential issuance
│   └── mock-data/           # Test data & development support
├── frontend-apps/            # 6 React applications
│   ├── mfe-certifier/       # Admin interface for KYC certification
│   ├── customer-web/        # Customer profile & management interface
│   ├── organisation-web/    # Organization management interface
│   ├── verification-web/    # Identity verification management interface
│   ├── remitter-ux/         # Self-service customer onboarding interface
│   └── website/             # Public-facing website with signup
├── shared-framework/         # Shared Go service framework
│   ├── go-svc/              # Go service framework
│   └── proto-bson/          # Protocol Buffer + BSON support
├── infrastructure/           # Infrastructure & deployment
│   ├── modules/             # Terraform infrastructure modules
│   ├── docker-compose.infrastructure.yml
│   └── Terraform configurations
├── testing/                  # Testing & mock services
│   └── mock-external-service/ # Mock external API services
├── scripts/                  # Setup & deployment scripts
│   └── setup-ekyc-2025.sh   # Complete platform setup script
└── documentation/            # Platform documentation
    ├── README.md            # Main eKYC platform documentation
    ├── Docs-main-README.md  # Documentation from Docs-main
    └── docs-main-2-README.md # Documentation from docs-main-2
```

## Technology Stack

### Backend
- **Language**: Go (Golang) 1.17
- **API**: gRPC with REST gateways
- **Protocol**: Protocol Buffers
- **Database**: MongoDB 5.0
- **Search**: Elasticsearch 7.17
- **Framework**: Custom go-svc framework

### Frontend
- **Framework**: React 17
- **UI Library**: Material-UI 5
- **Build Tools**: Webpack 5, Babel
- **State Management**: React Context/Hooks
- **API Communication**: gRPC-Web

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes (Terraform modules)
- **Service Mesh**: Istio
- **Monitoring**: Instana, Kibana
- **Authentication**: Auth0

## Key Features

### 1. Digital Onboarding
- Self-service onboarding process
- Mobile-optimized document scanning
- Real-time validation and feedback
- Multi-step guided workflow

### 2. Identity Verification
- Document authenticity verification
- Biometric verification (face matching, liveness detection)
- Address verification and validation
- Automated data extraction (OCR)

### 3. Compliance Management
- AML/CFT compliance framework
- Automated risk profiling
- Complete audit trail
- Enhanced Due Diligence (EDD) workflows

### 4. Security & Privacy
- End-to-end encryption
- Secure data storage
- Role-based access control
- GDPR and privacy compliance

### 5. Multi-tenant Architecture
- Isolated tenant environments
- Organization onboarding
- Subscription management
- User administration

## Service Dependencies

### Core Dependencies
- **go-svc**: Shared Go service framework
- **proto-bson**: Protocol Buffer + BSON support
- **MongoDB**: Document database
- **Elasticsearch**: Search and analytics
- **gRPC**: Inter-service communication

### External Service Integrations
- **Auth0**: Identity and access management
- **Stripe**: Billing and subscriptions
- **GBG**: Identity verification services
- **ActiveCampaign**: Marketing automation

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Go 1.17+
- Node.js 16+
- buf (Protocol Buffer tool)

### 1. Start Infrastructure
```bash
cd infrastructure
docker-compose -f docker-compose.infrastructure.yml up -d
```

### 2. Setup Complete Platform
```bash
cd scripts
chmod +x setup-ekyc-2025.sh
./setup-ekyc-2025.sh
```

### 3. Start Services
```bash
./start-ekyc-2025.sh
```

## Service Ports

### Backend Services
- Customer Service: 3200
- Customer V1 Service: 3201
- Identity Service: 3202
- KYC Certifier: 3203
- ID Verifier: 3204
- ID Check: 3205
- User Service: 3206
- Subscription: 3207
- Reporting Entity: 3208
- Key Person: 3209
- VC Issuer: 3210
- Mock Data: 3211

### Frontend Applications
- Customer Web: 3215
- Organisation Web: 3216
- Verification Web: 3217
- MFE Certifier: 3218
- Remitter UX: 3219
- Website: 3220

### Infrastructure
- MongoDB: 27017
- Elasticsearch: 9200
- Kibana: 5601
- Mock External Service: 8092

## Development Workflow

### Backend Development
1. Navigate to specific service directory
2. Run `buf mod update` to update dependencies
3. Run `buf generate` to generate Protocol Buffers
4. Use `go run main.go` for local development
5. Use `make build` for building Docker images

### Frontend Development
1. Navigate to specific app directory
2. Run `npm install` to install dependencies
3. Run `npm start` to start development server
4. Use `npm run build` for production builds

### Protocol Buffer Development
1. Edit `.proto` files in `proto/` directories
2. Run `buf generate` to regenerate Go code
3. Update frontend gRPC-Web clients if needed

## Testing

### Backend Testing
- Unit tests in `_tests/` directories
- Integration tests with mock services
- Protocol Buffer validation tests

### Frontend Testing
- React component testing
- Integration testing with mock APIs
- End-to-end workflow testing

### Mock Services
- Complete mock external service implementation
- No real external dependencies required
- Perfect for development and testing

## Deployment

### Local Development
- Docker Compose for infrastructure
- Individual service development
- Mock external services

### Production
- Kubernetes deployment via Terraform
- Istio service mesh
- Monitoring and logging
- High availability configuration

## Compliance & Security

### AML/CFT Compliance
- Customer Due Diligence (CDD)
- Enhanced Due Diligence (EDD)
- Risk assessment and profiling
- Regulatory reporting capabilities

### Data Protection
- GDPR compliance
- Data minimization
- Consent management
- Right to erasure

## Monitoring & Analytics

### Application Monitoring
- Service health monitoring
- Performance metrics
- Error tracking and alerting

### Business Analytics
- Onboarding conversion rates
- Verification success rates
- Compliance metrics
- User experience analytics

## Support & Documentation

### User Documentation
- Customer onboarding guides
- Admin user manuals
- API documentation
- Integration guides

### Technical Documentation
- Architecture documentation
- Deployment guides
- Troubleshooting guides
- Security documentation

## Migration Notes

### What Was Migrated
- ✅ All 12 backend microservices
- ✅ All 6 frontend applications
- ✅ Complete infrastructure configuration
- ✅ Shared frameworks and utilities
- ✅ Testing and mock services
- ✅ Setup and deployment scripts
- ✅ Complete documentation

### Dependencies Preserved
- ✅ Go module dependencies
- ✅ Node.js package dependencies
- ✅ Protocol Buffer definitions
- ✅ Docker configurations
- ✅ Terraform infrastructure
- ✅ Build configurations

### External Dependencies
- ✅ Mock external services included
- ✅ No real external API keys required
- ✅ Complete local development environment

## Next Steps

1. **Review Migration**: Verify all components migrated correctly
2. **Test Setup**: Run the setup script to validate functionality
3. **Customize Configuration**: Update environment variables as needed
4. **Deploy Services**: Start individual services or complete platform
5. **Integration Testing**: Test end-to-end workflows
6. **Production Deployment**: Deploy to production environment

## Troubleshooting

### Common Issues
- **Port Conflicts**: Ensure no other services use required ports
- **Dependencies**: Run `buf mod update` and `npm install` in service directories
- **Database**: Ensure MongoDB is running and accessible
- **Build Issues**: Check Go and Node.js versions match requirements

### Support
- Check individual service README files
- Review setup script output for errors
- Verify infrastructure services are running
- Check Docker container logs

## License

This project is proprietary software. Please contact the development team for licensing information.

---

**Migration Completed**: August 21, 2024  
**Total Components**: 18 services + infrastructure + documentation  
**Status**: Ready for deployment and testing
