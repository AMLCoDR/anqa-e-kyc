# eKYC Application - Quick Start Guide

## Get Started in 5 Minutes

This guide will get you up and running with the migrated eKYC application quickly.

## Prerequisites Check

First, ensure you have the required tools installed:

```bash
# Check Go version (requires 1.17+)
go version

# Check Node.js version (requires 16+)
node --version

# Check Docker
docker --version

# Check Docker Compose
docker-compose --version

# Install buf if not present
go install github.com/bufbuild/buf/cmd/buf@latest
```

## Quick Start Guide

### 1. Navigate to the Application
```bash
cd anqa-e-kyc
```

### 2. Verify Migration (Optional but Recommended)
```bash
./verify-migration.sh
```

### 3. Start Infrastructure Services
```bash
cd infrastructure
docker-compose -f docker-compose.infrastructure.yml up -d
cd ..
```

### 4. Setup Complete Platform
```bash
cd scripts
chmod +x setup-ekyc-2025.sh
./setup-ekyc-2025.sh
cd ..
```

### 5. Start All Services
```bash
./start-ekyc-2025.sh
```

## 🌐 Access Your Applications

Once started, you can access:

| Application | URL | Purpose |
|-------------|-----|---------|
| **Main Website** | http://localhost:3220 | Public signup and registration |
| **Customer Portal** | http://localhost:3215 | Customer profile management |
| **Admin Dashboard** | http://localhost:3218 | KYC workflow management |
| **Organization Portal** | http://localhost:3216 | Organization management |
| **Verification Interface** | http://localhost:3217 | Document verification |
| **Customer Onboarding** | http://localhost:3219 | Self-service onboarding |
| **Kibana** | http://localhost:5601 | Monitoring and analytics |

## Individual Service Development

### Backend Service Development

```bash
# Navigate to a specific service
cd backend-services/kyc-certifier

# Update dependencies
buf mod update

# Generate Protocol Buffers
buf generate

# Run locally
go run main.go

# Build Docker image
make build
```

### Frontend Application Development

```bash
# Navigate to a specific app
cd frontend-apps/mfe-certifier

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Testing Individual Components

### Test Backend Service
```bash
cd backend-services/kyc-certifier
go test ./...
```

### Test Frontend App
```bash
cd frontend-apps/mfe-certifier
npm test
```

### Test Infrastructure
```bash
cd infrastructure
terraform init
terraform plan
```

## Monitor Your Services

### Check Service Status
```bash
# Check running containers
docker ps

# Check service logs
docker logs ekyc-kyc-certifier
docker logs ekyc-mongodb
docker logs ekyc-elasticsearch
```

### Check Application Health
- **Kibana**: http://localhost:5601
- **MongoDB**: localhost:27017
- **Elasticsearch**: http://localhost:9200

## Common Development Tasks

### Adding a New Backend Service
1. Copy an existing service directory
2. Update `go.mod` with new module name
3. Update service-specific configurations
4. Add to docker-compose files

### Adding a New Frontend App
1. Copy an existing app directory
2. Update `package.json` with new app name
3. Update webpack configuration
4. Add to startup scripts

### Updating Protocol Buffers
1. Edit `.proto` files
2. Run `buf generate` in service directory
3. Update frontend gRPC-Web clients if needed

## Troubleshooting

### Service Won't Start
```bash
# Check if ports are in use
lsof -i :3200
lsof -i :3215

# Check Docker container status
docker ps -a
docker logs <container-name>
```

### Build Failures
```bash
# Clean and rebuild
cd backend-services/kyc-certifier
make clean
make build

# For frontend apps
cd frontend-apps/mfe-certifier
npm run clean
npm install
npm run build
```

### Database Connection Issues
```bash
# Check MongoDB status
docker exec -it ekyc-mongodb mongosh

# Check Elasticsearch status
curl http://localhost:9200/_cluster/health
```

## Next Steps

### Learn More
- Read the main [README.md](README.md) for comprehensive documentation
- Review [MIGRATION-SUMMARY.md](MIGRATION-SUMMARY.md) for migration details
- Check individual service README files for specific information

### Advanced Configuration
- Customize environment variables in `.env` files
- Modify Terraform configurations for production deployment
- Update monitoring and logging configurations
- Configure external service integrations

### Production Deployment
- Review infrastructure modules
- Configure Kubernetes deployment
- Set up monitoring and alerting
- Configure production databases

## 🆘 Need Help?

### Quick Commands
```bash
# Verify everything is working
./verify-migration.sh

# Check service status
docker ps

# View logs
docker logs <service-name>

# Restart services
./stop-ekyc-2025.sh
./start-ekyc-2025.sh
```

### Common Issues
- **Port conflicts**: Change ports in `.env` files
- **Dependencies**: Run `npm install` and `buf mod update`
- **Build issues**: Check Go and Node.js versions
- **Database issues**: Restart infrastructure containers

---

**You're all set!** The eKYC application is now ready for development and testing.

**Next**: Start building features, running tests, or deploying to production!
