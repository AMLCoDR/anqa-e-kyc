# OCR Migration Guide: GBG to Anqa Proprietary

## Overview
This guide details the migration from GBG (GB Group) external OCR service to Anqa's proprietary OCR implementation.

## What Changed

### ✅ **Before (GBG Integration)**
- External API calls to `https://sydney.idscan.cloud/idscanEnterpriseSVC`
- Hardcoded GBG API key and endpoints
- Dependency on third-party service availability
- Limited customization options

### ✅ **After (Anqa Proprietary)**
- Internal OCR service using Tesseract
- Configurable endpoints and API keys
- Full control over processing logic
- Enhanced security and privacy
- Customizable confidence thresholds

## Migration Steps

### 1. **Frontend Changes**
```javascript
// OLD: GBG Service
import { IdCheckService } from '../Services/IdCheckService';
const sc = new IdCheckService();
const result = await sc.addIdDocument({ entryId, image });

// NEW: Anqa OCR Service
import { AnqaOCRService } from '../Services/AnqaOCRService';
const sc = new AnqaOCRService();
const result = await sc.processIdDocument({ entryId, image });
```

### 2. **Backend Changes**
```go
// OLD: External GBG calls
// NEW: Internal OCR processing with Tesseract
type OCRService struct {
    tesseractClient *gosseract.Client
    modelPath       string
}
```

### 3. **Environment Configuration**
```bash
# Copy and configure environment variables
cp env.example .env

# Update with your values
REACT_APP_ANQA_OCR_URL=http://your-ocr-service:8080/api/ocr
REACT_APP_ANQA_API_KEY=your-secure-api-key
REACT_APP_ANQA_TENANT=your-tenant-id
```

## New Features

### 🔍 **Enhanced OCR Capabilities**
- **Multi-language Support**: English, Spanish, French, Arabic
- **Document Type Detection**: Auto-detection of passport, driver's license, national ID
- **Field Extraction**: 50+ extracted fields with confidence scoring
- **Validation**: Built-in document authenticity checks

### 🎯 **Advanced Processing Options**
```javascript
const processingOptions = {
    extractText: true,
    extractFields: true,
    validateDocument: true,
    performLivenessCheck: false,
    confidenceThreshold: 0.8
};
```

### 📊 **Rich Metadata**
- Processing time tracking
- Confidence scores per field
- Version information
- Timestamp logging

## Configuration Options

### **Confidence Thresholds**
```javascript
// Adjustable confidence levels
REACT_APP_OCR_CONFIDENCE_THRESHOLD=0.8        // Document processing
REACT_APP_OCR_LIVENESS_THRESHOLD=0.7          // Selfie verification
REACT_APP_OCR_FACE_QUALITY_THRESHOLD=0.6      // Face quality
```

### **Supported Document Types**
```javascript
const supportedTypes = [
    'passport',
    'driver_license', 
    'national_id',
    'residence_permit',
    'military_id',
    'student_id'
];
```

### **Image Processing**
```javascript
const imageOptions = {
    maxSize: '10MB',
    formats: ['jpeg', 'jpg', 'png'],
    quality: 'high'
};
```

## API Endpoints

### **Document Processing**
```
POST /api/ocr/process-document
{
    "entryId": "uuid",
    "documentType": "auto-detect",
    "imageData": "base64",
    "imageFormat": "jpeg",
    "processingOptions": {...}
}
```

### **Selfie Processing**
```
POST /api/ocr/process-selfie
{
    "entryId": "uuid",
    "imageData": "base64",
    "imageFormat": "jpeg",
    "processingOptions": {...}
}
```

### **Service Information**
```
GET /api/ocr/supported-documents
GET /api/ocr/stats
```

## Response Format

### **Document Processing Response**
```json
{
    "success": true,
    "extractedData": {
        "documentType": "PASSPORT",
        "countryCode": "US",
        "documentNumber": "123456789",
        "firstName": "John",
        "lastName": "Doe",
        "birthDate": "1990-01-01",
        "expiryDate": "2030-01-01",
        "address": {...}
    },
    "overallConfidence": 0.95,
    "processingTime": 1250,
    "version": "2025.1.0",
    "timestamp": "2025-01-15T10:30:00Z"
}
```

## Error Handling

### **Common Error Scenarios**
```javascript
try {
    const result = await ocrService.processIdDocument(data);
} catch (error) {
    if (error.message.includes('OCR processing failed')) {
        // Handle OCR-specific errors
    } else if (error.message.includes('invalid image data')) {
        // Handle image format errors
    } else {
        // Handle general errors
    }
}
```

### **Fallback Mechanisms**
- Automatic retry with lower confidence thresholds
- Manual data entry fallback
- Image quality improvement suggestions

## Performance Optimization

### **Processing Improvements**
- **Parallel Processing**: Multiple documents simultaneously
- **Caching**: Results caching for repeated documents
- **Batch Processing**: Bulk document processing
- **Async Operations**: Non-blocking image processing

### **Resource Management**
- **Memory Optimization**: Efficient image handling
- **CPU Utilization**: Multi-threaded processing
- **Storage**: Temporary file cleanup

## Security Features

### **Data Protection**
- **Encryption**: End-to-end encryption
- **Authentication**: API key validation
- **Authorization**: Tenant-based access control
- **Audit Logging**: Complete processing audit trail

### **Privacy Compliance**
- **GDPR Ready**: Data minimization and retention
- **Local Processing**: No external data transmission
- **Secure Storage**: Encrypted temporary storage

## Testing

### **Unit Tests**
```bash
# Test OCR service
npm test -- --testPathPattern=AnqaOCRService

# Test backend handlers
go test ./handler/v2/...
```

### **Integration Tests**
```bash
# Test end-to-end OCR workflow
npm run test:integration:ocr

# Test performance
npm run test:performance:ocr
```

## Monitoring & Logging

### **Metrics to Track**
- Processing time per document
- Success/failure rates
- Confidence score distributions
- Error frequency by type

### **Logging**
```javascript
console.log('Anqa OCR Results', result);
console.log('Processing Time:', result.data.anqaMetadata.processingTime);
console.log('Confidence:', result.data.anqaMetadata.confidence);
```

## Troubleshooting

### **Common Issues**

#### **1. Tesseract Not Found**
```bash
# Install Tesseract
brew install tesseract  # macOS
sudo apt-get install tesseract-ocr  # Ubuntu
```

#### **2. Image Processing Failures**
- Check image format (JPEG/PNG only)
- Verify image size (< 10MB)
- Ensure image quality (minimum 300 DPI)

#### **3. Low Confidence Scores**
- Improve image lighting
- Reduce image noise
- Use higher resolution images
- Check document orientation

### **Debug Mode**
```javascript
// Enable debug logging
const ocrService = new AnqaOCRService();
ocrService.setDebugMode(true);
```

## Rollback Plan

### **If Migration Fails**
1. **Immediate Rollback**: Switch back to GBG service
2. **Gradual Migration**: Process subset of documents
3. **A/B Testing**: Compare both services
4. **Performance Analysis**: Identify bottlenecks

### **Rollback Commands**
```bash
# Revert to GBG service
git checkout HEAD~1 -- src/Services/IdCheckService.js
git checkout HEAD~1 -- src/KycCertifier/SelfOnboarder.js

# Restart services
npm run restart:services
```

## Support

### **Documentation**
- [OCR API Reference](./api-reference.md)
- [Configuration Guide](./configuration.md)
- [Performance Tuning](./performance.md)

### **Contact**
- **Technical Issues**: dev-team@anqa.com
- **Configuration Help**: platform-support@anqa.com
- **Emergency**: oncall@anqa.com

## Conclusion

The migration to Anqa's proprietary OCR provides:
- ✅ **Full Control**: Complete ownership of OCR processing
- ✅ **Enhanced Security**: No external data transmission
- ✅ **Better Performance**: Optimized for your use cases
- ✅ **Cost Savings**: No per-transaction fees
- ✅ **Customization**: Tailored to your requirements

This migration represents a significant step toward platform independence and enhanced security for your eKYC operations.
