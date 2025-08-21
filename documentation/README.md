# eKYC 2025 - Electronic Know Your Customer Platform

## Overview

The eKYC 2025 platform is a comprehensive electronic Know Your Customer (KYC) and identity verification system designed for financial institutions and regulated entities. This platform provides end-to-end digital onboarding, identity verification, and compliance management capabilities in accordance with AML/CFT regulations.

## System Architecture

### Core Services

#### 1. KYC Certification Service (`kyc-certifier-main/`)
- **Purpose**: Central KYC certification and verification orchestration
- **Features**:
  - New person registration and onboarding
  - ID document verification (passport, driver's license, national ID)
  - Address verification
  - Customer creation and management
  - Consent and data sharing management
- **API**: gRPC-based service with REST endpoints
- **Protocol**: Protobuf definitions for type-safe communication

#### 2. Identity Verification Service (`id-verifier-main/`)
- **Purpose**: Document and identity verification processing
- **Features**:
  - Document authenticity verification
  - Data extraction from identity documents
  - Face matching and biometric verification
  - Liveness detection
  - Address validation
- **Integration**: GBG (GB Group) identity verification services

#### 3. ID Check Service (`id-check-main/`)
- **Purpose**: Real-time identity document checking
- **Features**:
  - Document scanning and OCR
  - Address verification and validation
  - Proof of address document processing
  - Automated data extraction
- **KYC Integration**: Direct integration with KYC workflows

#### 4. Identity Management Service (`identity-main/`)
- **Purpose**: Central identity lifecycle management
- **Features**:
  - Identity creation and management
  - Identity verification status tracking
  - Identity linking and relationships
  - Audit trail and compliance reporting

### Customer & Tenant Management Services

#### 5. User Management Service (`user-main/`)
- **Purpose**: User account and tenant management
- **Features**:
  - User registration and signup
  - Tenant creation and management
  - Auth0 integration for authentication
  - ActiveCampaign integration for marketing
  - Role-based access control
- **Workflow**: Organization creation → User registration → Tenant setup → Subscription creation

#### 6. Reporting Entity Service (`reporting-entity-main/`)
- **Purpose**: Organization and reporting entity management
- **Features**:
  - Organization registration and onboarding
  - Reporting entity creation for regulatory compliance
  - Contact information management
  - Organization profile management
  - Integration with subscription services

#### 7. Subscription Management Service (`subscription-main/`)
- **Purpose**: Billing and subscription management
- **Features**:
  - Stripe integration for billing
  - Subscription plan management (Starter, Professional, Premium)
  - Trial period management (21-day trial)
  - Usage quotas and limits
  - Customer portal access
  - Webhook handling for subscription events

### Frontend Applications

#### 1. KYC Certifier Frontend (`mfe-certifier-main/`)
- **Purpose**: Admin interface for KYC certification
- **Features**:
  - KYC workflow management
  - Document verification interface
  - Customer onboarding dashboard
  - Compliance reporting tools
- **Technology**: React with Material-UI

#### 2. Customer Onboarding UX (`remitter-ux-main/`)
- **Purpose**: Self-service customer onboarding interface
- **Features**:
  - Multi-step onboarding wizard
  - Document scanning and capture
  - Selfie and liveness detection
  - Address search and verification
  - Real-time validation and feedback
- **Components**:
  - `SelfOnboarder.js`: Complete onboarding flow
  - `IdScan.js`: Document and selfie capture
  - `AddressSearch.js`: Address lookup and validation
  - `ReviewDetails.js`: Data review and confirmation

#### 3. Verification Web Interface (`verification-web-main/`)
- **Purpose**: Identity verification management interface
- **Features**:
  - Document verification dashboard
  - Verification status tracking
  - Manual review tools
  - Compliance reporting
- **Supported Documents**:
  - Passport verification
  - Driver's license verification
  - National ID verification
  - Address verification
  - Enhanced Due Diligence (EDD)

#### 4. Customer Web Interface (`customer-web-main/`)
- **Purpose**: Customer profile and management interface
- **Features**:
  - Customer profile management
  - KYC status tracking
  - Document management
  - Risk assessment display

#### 5. Organization Web Interface (`organisation-web-main/`)
- **Purpose**: Organization management and profile interface
- **Features**:
  - Organization profile management
  - Reporting entity configuration
  - Contact information management
  - Compliance settings

#### 6. Website & Public Interface (`website-Material-UI-5/`)
- **Purpose**: Public-facing website with signup and registration
- **Features**:
  - Public signup and registration forms
  - Beta registration system
  - Account creation workflow
  - Marketing integration (ActiveCampaign)
  - Terms of service and privacy policy

### Customer Management Services

#### 1. Customer Service (`customer-main/`, `customer-v1-main/`)
- **Purpose**: Customer lifecycle management
- **Features**:
  - Customer creation and onboarding
  - Profile management
  - KYC status tracking
  - Customer relationship management
- **API**: gRPC-based customer management

#### 2. Key Person Risk Service (`key-person-main/`)
- **Purpose**: Key person identification and risk assessment
- **Features**:
  - Key person identification
  - Risk profiling
  - Enhanced due diligence
  - Compliance reporting

### Verifiable Credentials

#### VC Issuer Service (`vc-issuer-main/`)
- **Purpose**: Digital identity credential issuance
- **Features**:
  - Verifiable credential creation
  - Digital identity issuance
  - Credential verification
  - Blockchain-based identity management

### Testing and Development

#### Mock Data Service (`mock-data-main/`)
- **Purpose**: Test data and development support
- **Features**:
  - Mock identity documents
  - Test customer data
  - KYC workflow testing
  - Integration testing support

### Infrastructure Support

#### Infrastructure Modules (`infrastructure-kyc/`)
- **Auth0 Module**: Identity and access management
- **Elastic Module**: Search and analytics
- **MongoDB Module**: Document database
- **Key Vault Module**: Secure key management
- **Secrets Module**: Secret management

## Key Features

### 1. Digital Onboarding
- **Self-Service Onboarding**: Complete digital onboarding process
- **Document Capture**: Mobile-optimized document scanning
- **Real-time Validation**: Instant feedback and validation
- **Multi-step Workflow**: Guided onboarding experience

### 2. Identity Verification
- **Document Verification**: Authenticity and validity checks
- **Biometric Verification**: Face matching and liveness detection
- **Address Verification**: Proof of address validation
- **Data Extraction**: Automated OCR and data capture

### 3. Compliance Management
- **AML/CFT Compliance**: Regulatory compliance framework
- **Risk Assessment**: Automated risk profiling
- **Audit Trail**: Complete audit and compliance reporting
- **Enhanced Due Diligence**: EDD workflows and tools

### 4. Security and Privacy
- **Data Encryption**: End-to-end encryption
- **Secure Storage**: Encrypted data storage
- **Access Control**: Role-based access management
- **Privacy Protection**: GDPR and privacy compliance

### 5. Tenant & Organization Management
- **Multi-tenant Architecture**: Isolated tenant environments
- **Organization Onboarding**: Complete organization registration
- **Subscription Management**: Billing and plan management
- **User Management**: Role-based user administration

## Technology Stack

### Backend
- **Language**: Go (Golang)
- **API**: gRPC with REST gateways
- **Protocol**: Protocol Buffers
- **Database**: MongoDB
- **Search**: Elasticsearch
- **Authentication**: Auth0
- **Billing**: Stripe
- **Marketing**: ActiveCampaign

### Frontend
- **Framework**: React
- **UI Library**: Material-UI
- **State Management**: React Context/Hooks
- **Camera**: react-html5-camera-photo
- **Face Detection**: face-api.js
- **Build**: Webpack

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Service Mesh**: Istio
- **Monitoring**: Instana
- **Logging**: Filebeat

## API Documentation

### KYC Certification API
```protobuf
service KycCertifierService {
  rpc NewPerson(NewPersonRequest) returns (NewPersonResponse);
  rpc VerifyId(VerifyIdRequest) returns (VerifyIdResponse);
}
```

### Identity Verification API
```protobuf
service IdentityVerifierService {
  rpc VerifyDocument(VerifyDocumentRequest) returns (VerifyDocumentResponse);
  rpc VerifyAddress(VerifyAddressRequest) returns (VerifyAddressResponse);
  rpc VerifyBiometric(VerifyBiometricRequest) returns (VerifyBiometricResponse);
}
```

### User Management API
```protobuf
service UserService {
  rpc SignUp(SignUpRequest) returns (SignUpResponse);
  rpc Add(AddRequest) returns (AddResponse);
  rpc Query(QueryRequest) returns (QueryResponse);
}
```

### Subscription API
```protobuf
service SubscriptionService {
  rpc Create(CreateRequest) returns (CreateResponse);
  rpc Get(GetRequest) returns (GetResponse);
  rpc AccessPortal(AccessPortalRequest) returns (AccessPortalResponse);
  rpc Delete(DeleteRequest) returns (DeleteResponse);
}
```

## Deployment

### Prerequisites
- Kubernetes cluster
- MongoDB instance
- Elasticsearch cluster
- Auth0 tenant
- Stripe account
- ActiveCampaign account
- GBG API credentials

### Installation
1. Deploy infrastructure modules
2. Deploy core services
3. Deploy frontend applications
4. Configure integrations
5. Set up monitoring and logging

## Compliance and Regulations

### AML/CFT Compliance
- **Customer Due Diligence (CDD)**: Standard and enhanced due diligence
- **Identity Verification**: Multi-factor identity verification
- **Risk Assessment**: Automated risk profiling
- **Transaction Monitoring**: Integration with transaction monitoring
- **Reporting**: Regulatory reporting capabilities

### Data Protection
- **GDPR Compliance**: European data protection compliance
- **Data Minimization**: Minimal data collection and retention
- **Consent Management**: Explicit consent tracking
- **Right to Erasure**: Data deletion capabilities

## Testing

### Unit Testing
- Go unit tests for all services
- React component testing
- API integration testing

### Integration Testing
- End-to-end workflow testing
- Third-party service integration
- Performance testing

### Compliance Testing
- Regulatory compliance validation
- Security testing
- Privacy impact assessment

## Monitoring and Analytics

### Application Monitoring
- Service health monitoring
- Performance metrics
- Error tracking and alerting

### Business Analytics
- Onboarding conversion rates
- Verification success rates
- Compliance metrics
- User experience analytics

## Support and Documentation

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

## Roadmap

### Phase 1 (Current)
- Core KYC functionality
- Basic identity verification
- Customer onboarding

### Phase 2 (Planned)
- Advanced biometric verification
- AI-powered risk assessment
- Enhanced compliance reporting

### Phase 3 (Future)
- Blockchain-based identity
- Cross-border KYC
- Advanced analytics and insights

## Contributing

Please refer to the individual service documentation for contribution guidelines and development setup instructions.

## License

This project is proprietary software. Please contact the development team for licensing information. 