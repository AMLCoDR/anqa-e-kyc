#!/bin/bash

# eKYC Migration Verification Script
# This script verifies that all components were migrated correctly

set -e

echo "🔍 Verifying eKYC Migration..."

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

# Check if we're in the right directory
if [ ! -d "backend-services" ] || [ ! -d "frontend-apps" ]; then
    print_error "Please run this script from the anqa-e-kyc directory"
    exit 1
fi

print_status "Starting migration verification..."

# Initialize counters
total_checks=0
passed_checks=0
failed_checks=0

# Function to check directory
check_directory() {
    local dir_path=$1
    local description=$2
    total_checks=$((total_checks + 1))
    
    if [ -d "$dir_path" ] && [ "$(ls -A $dir_path 2>/dev/null)" ]; then
        print_success "$description: ✓ ($(ls -1 $dir_path | wc -l) items)"
        passed_checks=$((passed_checks + 1))
    else
        print_error "$description: ✗ (missing or empty)"
        failed_checks=$((failed_checks + 1))
    fi
}

# Function to check file
check_file() {
    local file_path=$1
    local description=$2
    total_checks=$((total_checks + 1))
    
    if [ -f "$file_path" ]; then
        print_success "$description: ✓"
        passed_checks=$((passed_checks + 1))
    else
        print_error "$description: ✗ (missing)"
        failed_checks=$((failed_checks + 1))
    fi
}

echo ""
echo "📁 Checking Directory Structure..."

# Check main directories
check_directory "backend-services" "Backend Services Directory"
check_directory "frontend-apps" "Frontend Applications Directory"
check_directory "shared-framework" "Shared Framework Directory"
check_directory "infrastructure" "Infrastructure Directory"
check_directory "testing" "Testing Directory"
check_directory "scripts" "Scripts Directory"
check_directory "documentation" "Documentation Directory"

echo ""
echo "🔧 Checking Backend Services..."

# Check backend services
check_directory "backend-services/kyc-certifier" "KYC Certifier Service"
check_directory "backend-services/id-verifier" "ID Verifier Service"
check_directory "backend-services/id-check" "ID Check Service"
check_directory "backend-services/identity" "Identity Service"
check_directory "backend-services/customer" "Customer Service"
check_directory "backend-services/customer-v1" "Customer V1 Service"
check_directory "backend-services/user" "User Service"
check_directory "backend-services/subscription" "Subscription Service"
check_directory "backend-services/reporting-entity" "Reporting Entity Service"
check_directory "backend-services/key-person" "Key Person Service"
check_directory "backend-services/vc-issuer" "VC Issuer Service"
check_directory "backend-services/mock-data" "Mock Data Service"

echo ""
echo "🎨 Checking Frontend Applications..."

# Check frontend applications
check_directory "frontend-apps/mfe-certifier" "MFE Certifier App"
check_directory "frontend-apps/customer-web" "Customer Web App"
check_directory "frontend-apps/organisation-web" "Organisation Web App"
check_directory "frontend-apps/verification-web" "Verification Web App"
check_directory "frontend-apps/remitter-ux" "Remitter UX App"
check_directory "frontend-apps/website" "Website App"

echo ""
echo "🏗️ Checking Shared Framework..."

# Check shared framework components
check_directory "shared-framework/flg" "Go Service Framework (flg)"
check_directory "shared-framework/srv" "Go Service Framework (srv)"
check_directory "shared-framework/codec" "Proto BSON Codec"
check_directory "shared-framework/proto" "Proto BSON Proto"

echo ""
echo "⚙️ Checking Infrastructure..."

# Check infrastructure components
check_directory "infrastructure/modules" "Terraform Modules"
check_file "infrastructure/docker-compose.infrastructure.yml" "Docker Compose Infrastructure"
check_file "infrastructure/main.tf" "Main Terraform Configuration"
check_file "infrastructure/variables.tf" "Terraform Variables"

echo ""
echo "🧪 Checking Testing Components..."

# Check testing components
check_directory "testing" "Mock External Service"

echo ""
echo "📜 Checking Scripts and Documentation..."

# Check scripts and documentation
check_file "scripts/setup-ekyc-2025.sh" "eKYC Setup Script"
check_file "README.md" "Main README"
check_file "documentation/README.md" "eKYC Documentation"

echo ""
echo "🔍 Checking Critical Files..."

# Check critical files in key services
check_file "backend-services/kyc-certifier/go.mod" "KYC Certifier Go Module"
check_file "backend-services/kyc-certifier/main.go" "KYC Certifier Main"
check_file "frontend-apps/mfe-certifier/package.json" "MFE Certifier Package"
check_file "frontend-apps/mfe-certifier/webpack.config.js" "MFE Certifier Webpack Config"

echo ""
echo "📊 Migration Verification Summary"
echo "=================================="
echo "Total Checks: $total_checks"
echo "Passed: $passed_checks"
echo "Failed: $failed_checks"
echo "Success Rate: $(( (passed_checks * 100) / total_checks ))%"

if [ $failed_checks -eq 0 ]; then
    echo ""
    print_success "🎉 All components migrated successfully!"
    echo ""
    echo "✅ Migration Status: COMPLETE"
    echo "Ready for deployment and testing"
    echo ""
    echo "Next steps:"
    echo "1. Review the migrated components"
    echo "2. Run the setup script: ./scripts/setup-ekyc-2025.sh"
    echo "3. Test the platform functionality"
else
    echo ""
    print_warning "⚠️ Some components may not have migrated correctly"
    echo ""
    echo "Please review the failed checks above and re-run the migration if needed"
fi

echo ""
echo "📋 Migration Verification Complete"
