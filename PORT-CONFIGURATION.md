# 🔌 eKYC Application Port Configuration

## Port Range Update: 3200 Series

**Status**: ✅ **UPDATED**  
**Previous Range**: 8080-8091 (backend), 3010-3015 (frontend)  
**New Range**: 3200-3211 (backend), 3215-3220 (frontend)  
**Update Date**: August 21, 2024  

## 📊 Complete Port Mapping

### 🔧 Backend Services (3200-3211)

| Service | Port | Description | Status |
|---------|------|-------------|--------|
| **Customer Service** | 3200 | Customer lifecycle management | ✅ Updated |
| **Customer V1 Service** | 3201 | Customer service v1 | ✅ Updated |
| **Identity Service** | 3202 | Identity lifecycle management | ✅ Updated |
| **KYC Certifier** | 3203 | KYC certification orchestration | ✅ Updated |
| **ID Verifier** | 3204 | Document verification processing | ✅ Updated |
| **ID Check** | 3205 | Real-time document checking | ✅ Updated |
| **User Service** | 3206 | User account & tenant management | ✅ Updated |
| **Subscription** | 3207 | Billing & subscription management | ✅ Updated |
| **Reporting Entity** | 3208 | Organization management | ✅ Updated |
| **Key Person** | 3209 | Risk assessment | ✅ Updated |
| **VC Issuer** | 3210 | Digital credential issuance | ✅ Updated |
| **Mock Data** | 3211 | Test data & development | ✅ Updated |

### 🎨 Frontend Applications (3215-3220)

| Application | Port | Description | Status |
|-------------|------|-------------|--------|
| **Customer Web** | 3215 | Customer profile management | ✅ Updated |
| **Organisation Web** | 3216 | Organization management | ✅ Updated |
| **Verification Web** | 3217 | Document verification interface | ✅ Updated |
| **MFE Certifier** | 3218 | Admin KYC dashboard | ✅ Updated |
| **Remitter UX** | 3219 | Customer onboarding | ✅ Updated |
| **Website** | 3220 | Public website | ✅ Updated |

### ⚙️ Infrastructure Services

| Service | Port | Description | Status |
|---------|------|-------------|--------|
| **MongoDB** | 27017 | Database | ✅ Unchanged |
| **Elasticsearch** | 9200 | Search engine | ✅ Unchanged |
| **Kibana** | 5601 | Monitoring dashboard | ✅ Unchanged |
| **Mock External** | 8092 | Mock external APIs | ✅ Unchanged |

## 🔄 Port Migration Summary

### What Changed
- **Backend Services**: Moved from 8080-8091 → 3200-3211
- **Frontend Apps**: Moved from 3010-3015 → 3215-3220
- **Infrastructure**: Ports remain unchanged for compatibility

### Benefits of New Port Range
- **Avoids Conflicts**: No overlap with common development ports
- **Better Organization**: Logical grouping in 3200 series
- **Scalability**: Room for additional services in the range
- **Consistency**: All eKYC services now use 3200+ range

## Quick Access URLs

### Backend API Endpoints
```bash
# Core Services
curl http://localhost:3200/health    # Customer Service
curl http://localhost:3203/health    # KYC Certifier
curl http://localhost:3204/health    # ID Verifier

# Management Services
curl http://localhost:3206/health    # User Service
curl http://localhost:3207/health    # Subscription
curl http://localhost:3208/health    # Reporting Entity
```

### Frontend Applications
```bash
# User Interfaces
open http://localhost:3215    # Customer Portal
open http://localhost:3218    # Admin Dashboard
open http://localhost:3220    # Public Website

# Management Interfaces
open http://localhost:3216    # Organization Portal
open http://localhost:3217    # Verification Interface
open http://localhost:3219    # Customer Onboarding
```

## 📝 Configuration Files Updated

### ✅ Files Modified
1. **`scripts/setup-ekyc-2025.sh`** - Main setup script
2. **`README.md`** - Platform documentation
3. **`QUICK-START.md`** - Quick start guide
4. **`MIGRATION-SUMMARY.md`** - Migration documentation
5. **`CHANGELOG.md`** - Feature changelog
6. **`FINAL-MIGRATION-REPORT.md`** - Migration report
7. **`PORT-CONFIGURATION.md`** - This port guide

### 🔧 Environment Variables
```bash
# Backend Service Ports
CUSTOMER_SERVICE_PORT=3200
CUSTOMER_V1_SERVICE_PORT=3201
IDENTITY_SERVICE_PORT=3202
KYC_CERTIFIER_PORT=3203
ID_VERIFIER_PORT=3204
ID_CHECK_PORT=3205
USER_SERVICE_PORT=3206
SUBSCRIPTION_PORT=3207
REPORTING_ENTITY_PORT=3208
KEY_PERSON_PORT=3209
VC_ISSUER_PORT=3210
MOCK_DATA_PORT=3211

# Frontend Application Ports
CUSTOMER_WEB_PORT=3215
ORGANISATION_WEB_PORT=3216
VERIFICATION_WEB_PORT=3217
MFE_CERTIFIER_PORT=3218
REMITTER_UX_PORT=3219
WEBSITE_PORT=3220
```

## 🧪 Testing Port Configuration

### Port Availability Check
```bash
# Check if ports are available
for port in {3200..3211} {3215..3220}; do
  if lsof -i :$port > /dev/null 2>&1; then
    echo "⚠️  Port $port is in use"
  else
    echo "✅ Port $port is available"
  fi
done
```

### Service Health Check
```bash
# Check backend service health
for port in {3200..3211}; do
  echo "Checking port $port..."
  curl -s http://localhost:$port/health || echo "Service not responding"
done
```

## 🔍 Troubleshooting

### Common Port Issues
1. **Port Already in Use**
   ```bash
   # Find what's using a port
   lsof -i :3200
   
   # Kill process using port
   kill -9 $(lsof -t -i:3200)
   ```

2. **Service Won't Start**
   ```bash
   # Check port availability
   netstat -an | grep :3200
   
   # Check service logs
   docker logs <service-container>
   ```

3. **Port Range Conflicts**
   ```bash
   # Check entire 3200 range
   for port in {3200..3220}; do
     lsof -i :$port
   done
   ```

### Port Customization
If you need to change ports further:

1. **Update Environment File**
   ```bash
   # Edit .env file
   nano .env
   
   # Change port values
   CUSTOMER_SERVICE_PORT=3300
   ```

2. **Update Documentation**
   ```bash
   # Update all documentation files
   find . -name "*.md" -exec sed -i 's/3200/3300/g' {} \;
   ```

3. **Restart Services**
   ```bash
   # Restart with new configuration
   ./stop-ekyc-2025.sh
   ./start-ekyc-2025.sh
   ```

## 📚 Related Documentation

- **README.md** - Complete platform overview
- **QUICK-START.md** - Get started guide with new ports
- **setup-ekyc-2025.sh** - Setup script with port configuration
- **verify-migration.sh** - Migration verification

## 🎯 Next Steps

### Immediate Actions
1. **Verify Port Configuration**: Check that all ports are available
2. **Test Services**: Start services and verify they bind to correct ports
3. **Update Local Configs**: Update any local development configurations

### Development Workflow
1. **Service Development**: Use new ports for local development
2. **Integration Testing**: Test inter-service communication with new ports
3. **Documentation**: Keep port references updated in new features

---

**Port Configuration Status**: ✅ **COMPLETE**  
**All Services Updated**: 18/18  
**Documentation Updated**: 7/7  
**Ready for Development**: ✅ **YES**  

**🎉 Port configuration update complete! All eKYC services now use the 3200+ range.**
