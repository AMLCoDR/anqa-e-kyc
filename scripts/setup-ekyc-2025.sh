#!/bin/bash

# eKYC 2025 Complete Platform Setup Script
# Using components from Anqa 2021 directory

set -e

echo "🚀 Starting eKYC 2025 Complete Platform Setup from Anqa 2021..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if Go is installed
    if ! command -v go &> /dev/null; then
        print_error "Go is not installed. Please install Go first."
        exit 1
    fi
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check if buf is installed
    if ! command -v buf &> /dev/null; then
        print_warning "buf is not installed. Installing buf..."
        go install github.com/bufbuild/buf/cmd/buf@latest
    fi
    
    print_success "All prerequisites are satisfied!"
}

# Create environment file
create_env_file() {
    print_status "Creating environment configuration..."
    
    cat > .env << EOF
# eKYC 2025 Environment Configuration

# MongoDB Configuration
MONGODB_HOST=localhost:27017
MONGODB_USER=ekyc_user
MONGODB_PWD=ekyc_password
MONGODB_DATABASE=ekyc_db

# Elasticsearch Configuration
ELASTICSEARCH_HOST=localhost:9200
ELASTICSEARCH_USER=elastic
ELASTICSEARCH_PASSWORD=changeme

# Mock External Services Configuration
AUTH0_DOMAIN=mock-auth0.local
AUTH0_CLIENT_ID=mock-client-id
AUTH0_CLIENT_SECRET=mock-client-secret

STRIPE_SECRET_KEY=sk_test_mock_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_mock_stripe_key

GBG_API_KEY=mock_gbg_api_key
GBG_API_SECRET=mock_gbg_api_secret

ACTIVECAMPAIGN_API_KEY=mock_activecampaign_key
ACTIVECAMPAIGN_URL=http://localhost:3292/mock/activecampaign

# Service Ports (Updated to 3200 range)
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

# Frontend Ports (Updated to 3200 range)
CUSTOMER_WEB_PORT=3215
ORGANISATION_WEB_PORT=3216
VERIFICATION_WEB_PORT=3217
MFE_CERTIFIER_PORT=3218
REMITTER_UX_PORT=3219
WEBSITE_PORT=3220

# Development Configuration
NODE_ENV=development
GO_ENV=development
STANDALONE_MODE=true
EOF

    print_success "Environment file created (.env)"
}

# Setup infrastructure services
setup_infrastructure() {
    print_status "Setting up infrastructure services..."
    
    # Create docker-compose file for infrastructure
    cat > docker-compose.infrastructure.yml << EOF
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    container_name: ekyc-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: \${MONGODB_USER}
      MONGO_INITDB_ROOT_PASSWORD: \${MONGODB_PWD}
      MONGO_INITDB_DATABASE: \${MONGODB_DATABASE}
    volumes:
      - mongodb_data:/data/db
    command: mongod --auth

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.0
    container_name: ekyc-elasticsearch
    restart: unless-stopped
    ports:
      - "9200:9200"
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  kibana:
    image: docker.elastic.co/kibana/kibana:7.17.0
    container_name: ekyc-kibana
    restart: unless-stopped
    ports:
      - "5601:5601"
    environment:
      ELASTICSEARCH_HOSTS: http://elasticsearch:9200
    depends_on:
      - elasticsearch

volumes:
  mongodb_data:
  elasticsearch_data:
EOF

    # Start infrastructure services
    docker-compose -f docker-compose.infrastructure.yml up -d
    
    print_success "Infrastructure services started!"
    print_status "Waiting for services to be ready..."
    sleep 30
}

# Create mock external service
create_mock_service() {
    print_status "Creating mock external service..."
    
    mkdir -p mock-external-service
    
    cat > mock-external-service/Dockerfile << EOF
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
EOF

    cat > mock-external-service/package.json << EOF
{
  "name": "mock-external-service",
  "version": "1.0.0",
  "description": "Mock external services for eKYC platform",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "cors": "^2.8.5"
  }
}
EOF

    cat > mock-external-service/server.js << EOF
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Mock Auth0 endpoints
app.post('/oauth/token', (req, res) => {
  res.json({
    access_token: 'mock_access_token',
    token_type: 'Bearer',
    expires_in: 86400
  });
});

app.get('/userinfo', (req, res) => {
  res.json({
    sub: 'mock_user_id',
    email: 'user@example.com',
    name: 'Mock User'
  });
});

// Mock Stripe endpoints
app.post('/v1/payment_intents', (req, res) => {
  res.json({
    id: 'pi_mock_payment_intent',
    amount: 2000,
    currency: 'usd',
    status: 'requires_payment_method'
  });
});

app.post('/v1/customers', (req, res) => {
  res.json({
    id: 'cus_mock_customer',
    email: 'customer@example.com',
    created: Date.now() / 1000
  });
});

// Mock GBG endpoints
app.post('/api/verify', (req, res) => {
  res.json({
    verification_id: 'mock_verification_id',
    status: 'verified',
    confidence_score: 0.95
  });
});

// Mock ActiveCampaign endpoints
app.post('/api/3/contacts', (req, res) => {
  res.json({
    contact: {
      id: 'mock_contact_id',
      email: 'contact@example.com'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'mock-external' });
});

app.listen(PORT, () => {
  console.log(\`Mock external service running on port \${PORT}\`);
});
EOF

    print_success "Mock external service created!"
}

# Generate protocol buffers for backend services
generate_protos() {
    print_status "Generating protocol buffers for backend services..."
    
    # List of backend services
    services=(
        "customer-main"
        "customer-v1-main"
        "identity-main"
        "kyc-certifier-main"
        "id-verifier-main"
        "id-check-main"
        "user-main"
        "subscription-main"
        "reporting-entity-main"
        "key-person-main"
        "vc-issuer-main"
        "mock-data-main"
    )
    
    for service in "\${services[@]}"; do
        if [ -d "$service" ] && [ -f "$service/buf.yaml" ]; then
            print_status "Generating protos for $service..."
            cd "$service"
            buf mod update 2>/dev/null || true
            buf generate 2>/dev/null || print_warning "Failed to generate protos for $service"
            cd ..
        fi
    done
    
    print_success "Protocol buffers generated!"
}

# Build and start backend services
setup_backend_services() {
    print_status "Setting up backend services..."
    
    # Create docker-compose file for backend services
    cat > docker-compose.backend.yml << EOF
version: '3.8'

services:
  mock-external:
    build: ./mock-external-service
    container_name: ekyc-mock-external
    restart: unless-stopped
    ports:
      - "8092:8080"
    networks:
      - ekyc-network

  customer-service:
    build: ./customer-main
    container_name: ekyc-customer-service
    restart: unless-stopped
    ports:
      - "\${CUSTOMER_SERVICE_PORT}:8080"
    environment:
      - MONGODB_HOST=mongodb
      - MONGODB_USER=\${MONGODB_USER}
      - MONGODB_PWD=\${MONGODB_PWD}
      - STANDALONE_MODE=true
    depends_on:
      - mongodb
    networks:
      - ekyc-network

  customer-v1-service:
    build: ./customer-v1-main
    container_name: ekyc-customer-v1-service
    restart: unless-stopped
    ports:
      - "\${CUSTOMER_V1_SERVICE_PORT}:8080"
    environment:
      - MONGODB_HOST=mongodb
      - MONGODB_USER=\${MONGODB_USER}
      - MONGODB_PWD=\${MONGODB_PWD}
      - STANDALONE_MODE=true
    depends_on:
      - mongodb
    networks:
      - ekyc-network

  identity-service:
    build: ./identity-main
    container_name: ekyc-identity-service
    restart: unless-stopped
    ports:
      - "\${IDENTITY_SERVICE_PORT}:8080"
    environment:
      - MONGODB_HOST=mongodb
      - MONGODB_USER=\${MONGODB_USER}
      - MONGODB_PWD=\${MONGODB_PWD}
      - STANDALONE_MODE=true
    depends_on:
      - mongodb
    networks:
      - ekyc-network

  kyc-certifier:
    build: ./kyc-certifier-main
    container_name: ekyc-kyc-certifier
    restart: unless-stopped
    ports:
      - "\${KYC_CERTIFIER_PORT}:8080"
    environment:
      - MONGODB_HOST=mongodb
      - MONGODB_USER=\${MONGODB_USER}
      - MONGODB_PWD=\${MONGODB_PWD}
      - STANDALONE_MODE=true
    depends_on:
      - mongodb
    networks:
      - ekyc-network

  id-verifier:
    build: ./id-verifier-main
    container_name: ekyc-id-verifier
    restart: unless-stopped
    ports:
      - "\${ID_VERIFIER_PORT}:8080"
    environment:
      - GBG_API_KEY=\${GBG_API_KEY}
      - GBG_API_SECRET=\${GBG_API_SECRET}
      - GBG_API_URL=http://mock-external:8080
      - STANDALONE_MODE=true
    depends_on:
      - mongodb
      - mock-external
    networks:
      - ekyc-network

  id-check:
    build: ./id-check-main
    container_name: ekyc-id-check
    restart: unless-stopped
    ports:
      - "\${ID_CHECK_PORT}:8080"
    environment:
      - MONGODB_HOST=mongodb
      - MONGODB_USER=\${MONGODB_USER}
      - MONGODB_PWD=\${MONGODB_PWD}
      - STANDALONE_MODE=true
    depends_on:
      - mongodb
    networks:
      - ekyc-network

  user-service:
    build: ./user-main
    container_name: ekyc-user-service
    restart: unless-stopped
    ports:
      - "\${USER_SERVICE_PORT}:8080"
    environment:
      - AUTH0_DOMAIN=\${AUTH0_DOMAIN}
      - AUTH0_CLIENT_ID=\${AUTH0_CLIENT_ID}
      - AUTH0_CLIENT_SECRET=\${AUTH0_CLIENT_SECRET}
      - AUTH0_API_URL=http://mock-external:8080
      - ACTIVECAMPAIGN_API_KEY=\${ACTIVECAMPAIGN_API_KEY}
      - ACTIVECAMPAIGN_URL=http://mock-external:8080
      - STANDALONE_MODE=true
    depends_on:
      - mongodb
      - mock-external
    networks:
      - ekyc-network

  subscription-service:
    build: ./subscription-main
    container_name: ekyc-subscription-service
    restart: unless-stopped
    ports:
      - "\${SUBSCRIPTION_PORT}:8080"
    environment:
      - STRIPE_SECRET_KEY=\${STRIPE_SECRET_KEY}
      - STRIPE_PUBLISHABLE_KEY=\${STRIPE_PUBLISHABLE_KEY}
      - STRIPE_API_URL=http://mock-external:8080
      - STANDALONE_MODE=true
    depends_on:
      - mongodb
      - mock-external
    networks:
      - ekyc-network

  reporting-entity:
    build: ./reporting-entity-main
    container_name: ekyc-reporting-entity
    restart: unless-stopped
    ports:
      - "\${REPORTING_ENTITY_PORT}:8080"
    environment:
      - MONGODB_HOST=mongodb
      - MONGODB_USER=\${MONGODB_USER}
      - MONGODB_PWD=\${MONGODB_PWD}
      - STANDALONE_MODE=true
    depends_on:
      - mongodb
    networks:
      - ekyc-network

  key-person:
    build: ./key-person-main
    container_name: ekyc-key-person
    restart: unless-stopped
    ports:
      - "\${KEY_PERSON_PORT}:8080"
    environment:
      - MONGODB_HOST=mongodb
      - MONGODB_USER=\${MONGODB_USER}
      - MONGODB_PWD=\${MONGODB_PWD}
      - STANDALONE_MODE=true
    depends_on:
      - mongodb
    networks:
      - ekyc-network

  vc-issuer:
    build: ./vc-issuer-main
    container_name: ekyc-vc-issuer
    restart: unless-stopped
    ports:
      - "\${VC_ISSUER_PORT}:8080"
    environment:
      - MONGODB_HOST=mongodb
      - MONGODB_USER=\${MONGODB_USER}
      - MONGODB_PWD=\${MONGODB_PWD}
      - STANDALONE_MODE=true
    depends_on:
      - mongodb
    networks:
      - ekyc-network

  mock-data:
    build: ./mock-data-main
    container_name: ekyc-mock-data
    restart: unless-stopped
    ports:
      - "\${MOCK_DATA_PORT}:8080"
    environment:
      - MONGODB_HOST=mongodb
      - MONGODB_USER=\${MONGODB_USER}
      - MONGODB_PWD=\${MONGODB_PWD}
      - STANDALONE_MODE=true
    depends_on:
      - mongodb
    networks:
      - ekyc-network

networks:
  ekyc-network:
    external: true
EOF

    # Create network
    docker network create ekyc-network 2>/dev/null || true
    
    # Start backend services
    docker-compose -f docker-compose.backend.yml up -d --build
    
    print_success "Backend services started!"
}

# Setup frontend applications
setup_frontend_apps() {
    print_status "Setting up frontend applications..."
    
    # Function to setup a frontend app
    setup_frontend_app() {
        local app_name=$1
        local app_dir=$2
        local port=$3
        
        print_status "Setting up $app_name..."
        
        if [ -d "$app_dir" ]; then
            cd "$app_dir"
            
            # Install dependencies
            npm install
            
            # Create .env file for the app
            cat > .env << EOF
REACT_APP_API_URL=http://localhost:8080
REACT_APP_AUTH0_DOMAIN=mock-auth0.local
REACT_APP_AUTH0_CLIENT_ID=mock-client-id
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_mock_stripe_key
REACT_APP_STANDALONE_MODE=true
PORT=$port
EOF
            
            # Start the app in background with Node.js compatibility
            export NODE_OPTIONS="--openssl-legacy-provider"
            npm start &
            
            cd ..
            print_success "$app_name started on port $port"
        else
            print_warning "$app_dir not found, skipping $app_name"
        fi
    }
    
    # Setup each frontend app
    setup_frontend_app "Customer Web" "customer-web-main" "3215"
    setup_frontend_app "Organisation Web" "organisation-web-main" "3216"
    setup_frontend_app "Verification Web" "verification-web-main" "3217"
    setup_frontend_app "MFE Certifier" "mfe-certifier-main" "3218"
    setup_frontend_app "Remitter UX" "remitter-ux-main" "3219"
    setup_frontend_app "Website" "website-Material-UI-5" "3220"
    
    print_success "Frontend applications setup completed!"
}

# Create startup script
create_startup_script() {
    print_status "Creating startup script..."
    
    cat > start-ekyc-2025.sh << 'EOF'
#!/bin/bash

# eKYC 2025 Startup Script

echo "🚀 Starting eKYC 2025 Complete Platform..."

# Load environment variables
source .env

# Start infrastructure
echo "Starting infrastructure services..."
docker-compose -f docker-compose.infrastructure.yml up -d

# Wait for infrastructure to be ready
echo "Waiting for infrastructure to be ready..."
sleep 30

# Start backend services
echo "Starting backend services..."
docker-compose -f docker-compose.backend.yml up -d

# Wait for backend services to be ready
echo "Waiting for backend services to be ready..."
sleep 30

# Start frontend applications
echo "Starting frontend applications..."
./setup-frontend-2025.sh

echo "✅ eKYC 2025 Complete Platform is starting up!"
echo ""
echo "📋 Service URLs:"
echo "  - Customer Web: http://localhost:3215"
echo "  - Organisation Web: http://localhost:3216"
echo "  - Verification Web: http://localhost:3217"
echo "  - MFE Certifier: http://localhost:3218"
echo "  - Remitter UX: http://localhost:3219"
echo "  - Website: http://localhost:3220"
echo "  - Kibana: http://localhost:5601"
echo "  - Mock External Service: http://localhost:8092"
echo ""
echo "🔧 Backend Services:"
echo "  - Customer Service: localhost:3200"
echo "  - Customer V1 Service: localhost:3201"
echo "  - Identity Service: localhost:3202"
echo "  - KYC Certifier: localhost:3203"
echo "  - ID Verifier: localhost:3204"
echo "  - ID Check: localhost:3205"
echo "  - User Service: localhost:3206"
echo "  - Subscription: localhost:3207"
echo "  - Reporting Entity: localhost:3208"
echo "  - Key Person: localhost:3209"
echo "  - VC Issuer: localhost:3210"
echo "  - Mock Data: localhost:3211"
echo ""
echo "🎭 Mock Services:"
echo "  - All external APIs are mocked"
echo "  - No real external dependencies required"
echo "  - Perfect for development and testing"
EOF

    chmod +x start-ekyc-2025.sh
    
    # Create frontend startup script
    cat > setup-frontend-2025.sh << 'EOF'
#!/bin/bash

# Frontend setup script for eKYC 2025

# Function to start a frontend app
start_frontend_app() {
    local app_name=$1
    local app_dir=$2
    local port=$3
    
    if [ -d "$app_dir" ]; then
        echo "Starting $app_name on port $port..."
        cd "$app_dir"
        export NODE_OPTIONS="--openssl-legacy-provider"
        npm start &
        cd ..
    fi
}

# Start each frontend app
start_frontend_app "Customer Web" "customer-web-main" "3215"
start_frontend_app "Organisation Web" "organisation-web-main" "3216"
start_frontend_app "Verification Web" "verification-web-main" "3217"
start_frontend_app "MFE Certifier" "mfe-certifier-main" "3218"
start_frontend_app "Remitter UX" "remitter-ux-main" "3219"
start_frontend_app "Website" "website-Material-UI-5" "3220"

echo "Frontend applications started!"
EOF

    chmod +x setup-frontend-2025.sh
    
    print_success "Startup scripts created!"
}

# Create stop script
create_stop_script() {
    print_status "Creating stop script..."
    
    cat > stop-ekyc-2025.sh << 'EOF'
#!/bin/bash

# eKYC 2025 Stop Script

echo "🛑 Stopping eKYC 2025 Complete Platform..."

# Stop backend services
docker-compose -f docker-compose.backend.yml down

# Stop infrastructure services
docker-compose -f docker-compose.infrastructure.yml down

# Kill frontend processes
pkill -f "npm start" || true

echo "✅ eKYC 2025 Complete Platform stopped!"
EOF

    chmod +x stop-ekyc-2025.sh
    print_success "Stop script created!"
}

# Main setup function
main() {
    echo "=========================================="
    echo "    eKYC 2025 Complete Platform Setup"
    echo "=========================================="
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Create environment file
    create_env_file
    
    # Create mock external service
    create_mock_service
    
    # Generate protocol buffers
    generate_protos
    
    # Setup infrastructure
    setup_infrastructure
    
    # Setup backend services
    setup_backend_services
    
    # Setup frontend applications
    setup_frontend_apps
    
    # Create startup and stop scripts
    create_startup_script
    create_stop_script
    
    echo ""
    echo "=========================================="
    echo "    Complete Setup Finished! 🎉"
    echo "=========================================="
    echo ""
    echo "📋 Next Steps:"
    echo "1. Run './start-ekyc-2025.sh' to start the complete platform"
    echo "2. Run './stop-ekyc-2025.sh' to stop the platform"
    echo ""
    echo "🌐 Access Points:"
    echo "  - Main Website: http://localhost:3220"
    echo "  - Customer Portal: http://localhost:3215"
    echo "  - Admin Dashboard: http://localhost:3218"
    echo "  - Kibana: http://localhost:5601"
    echo "  - Mock External Service: http://localhost:8092"
    echo ""
    echo "🎭 Features:"
    echo "  - Complete eKYC platform with all services"
    echo "  - 12 backend microservices"
    echo "  - 6 frontend applications"
    echo "  - Mock external services"
    echo "  - Local infrastructure"
    echo ""
    echo "⚠️  Note: This is a complete eKYC 2025 platform setup!"
    echo ""
}

# Run main function
main "$@" 