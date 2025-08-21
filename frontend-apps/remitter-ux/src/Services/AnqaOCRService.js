import axios from 'axios';

export class AnqaOCRService {
    constructor() {
        // Point to Anqa's internal OCR service instead of external GBG
        this.client = axios.create({
            baseURL: process.env.REACT_APP_ANQA_OCR_URL || 'http://localhost:8080/api/ocr',
            timeout: 30000, // 30 second timeout
        });
        
        // Initialize retry configuration
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second
        this.debugMode = false;
    }

    getHeaders() {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.REACT_APP_ANQA_API_KEY || 'anqa-ocr-key'}`,
                'X-Anqa-Tenant': process.env.REACT_APP_ANQA_TENANT || 'default'
            }
        };
    }

    /**
     * Process ID document with Anqa's proprietary OCR
     * @param {Object} props - Document processing parameters
     * @param {string} props.entryId - Unique entry identifier
     * @param {string} props.image - Base64 encoded image
     * @param {string} props.documentType - Type of document (optional)
     * @param {Function} onProgress - Progress callback function (optional)
     * @returns {Promise} OCR processing result
     */
    async processIdDocument(props, onProgress) {
        try {
            // Validate image before processing
            const validation = this.validateImage(props.image);
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Optimize image if needed
            const optimizedImage = await this.optimizeImage(props.image);
            
            let base64Result = optimizedImage.split(',')[1];
            
            const data = {
                entryId: props.entryId,
                documentType: props.documentType || 'auto-detect',
                imageData: base64Result,
                imageFormat: 'jpeg',
                processingOptions: {
                    extractText: true,
                    extractFields: true,
                    validateDocument: true,
                    performLivenessCheck: false,
                    confidenceThreshold: 0.8
                },
                metadata: {
                    platform: 'ANQA-eKYC',
                    version: '2025.1.0',
                    timestamp: new Date().toISOString()
                }
            };

            // Process with retry logic
            const response = await this.processWithRetry('/process-document', data, onProgress);
            return this.formatAnqaResponse(response.data);
            
        } catch (error) {
            console.error('Anqa OCR Error:', error);
            throw new Error(`OCR processing failed: ${error.message}`);
        }
    }

    /**
     * Process ID document with retry logic and fallback
     * @param {Object} props - Document processing parameters
     * @returns {Promise} OCR processing result
     */
    async processIdDocumentWithRetry(props) {
        let lastError;
        
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                return await this.processIdDocument(props);
            } catch (error) {
                lastError = error;
                
                if (attempt === this.maxRetries) {
                    break;
                }
                
                // Exponential backoff
                const delay = Math.pow(2, attempt) * this.retryDelay;
                await new Promise(resolve => setTimeout(resolve, delay));
                
                console.log(`OCR attempt ${attempt} failed, retrying in ${delay}ms...`);
            }
        }
        
        // All retries failed, try fallback processing
        return this.processIdDocumentFallback(props);
    }

    /**
     * Fallback processing with lower confidence threshold
     * @param {Object} props - Document processing parameters
     * @returns {Promise} OCR processing result
     */
    async processIdDocumentFallback(props) {
        const fallbackProps = {
            ...props,
            processingOptions: {
                ...props.processingOptions,
                confidenceThreshold: 0.6
            }
        };
        
        return await this.processIdDocument(fallbackProps);
    }

    /**
     * Process selfie with Anqa's face recognition
     * @param {Object} props - Selfie processing parameters
     * @param {string} props.entryId - Unique entry identifier
     * @param {string} props.image - Base64 encoded selfie image
     * @returns {Promise} Face recognition result
     */
    async processSelfie(props) {
        try {
            let base64Result = props.image.split(',')[1];
            
            const data = {
                entryId: props.entryId,
                imageData: base64Result,
                imageFormat: 'jpeg',
                processingOptions: {
                    extractText: false,
                    extractFields: false,
                    validateDocument: false,
                    performLivenessCheck: true,
                    faceMatching: true,
                    confidenceThreshold: 0.85
                },
                metadata: {
                    platform: 'ANQA-eKYC',
                    version: '2025.1.0',
                    timestamp: new Date().toISOString()
                }
            };

            const response = await this.client.post('/process-selfie', data, this.getHeaders());
            return this.formatAnqaResponse(response.data);
            
        } catch (error) {
            console.error('Anqa Selfie Processing Error:', error);
            throw new Error(`Selfie processing failed: ${error.message}`);
        }
    }

    /**
     * Format Anqa OCR response to match expected structure
     * @param {Object} anqaData - Raw Anqa OCR response
     * @returns {Object} Formatted response compatible with existing code
     */
    formatAnqaResponse(anqaData) {
        return {
            data: {
                CurrentResult: anqaData.success ? "Pass" : "Fail",
                EntryData: {
                    OverallAuthenticationState: anqaData.success ? "Passed" : "Failed",
                    DocumentType: anqaData.extractedData?.documentType || 'Unknown',
                    CountryCode: anqaData.extractedData?.countryCode || 'Unknown',
                    ExtractedFields: {
                        CardNumber: anqaData.extractedData?.cardNumber || '',
                        DocumentNumber: anqaData.extractedData?.documentNumber || '',
                        FirstName: anqaData.extractedData?.firstName || '',
                        MiddleName: anqaData.extractedData?.middleName || '',
                        LastName: anqaData.extractedData?.lastName || '',
                        BirthDate: anqaData.extractedData?.birthDate || '',
                        ExpiryDate: anqaData.extractedData?.expiryDate || '',
                        IssueDate: anqaData.extractedData?.issueDate || '',
                        Sex: anqaData.extractedData?.gender || '',
                        NationalityCode: anqaData.extractedData?.nationality || '',
                        AddressLine1: anqaData.extractedData?.address?.line1 || '',
                        AddressLine2: anqaData.extractedData?.address?.line2 || '',
                        AddressCity: anqaData.extractedData?.address?.city || '',
                        AddressState: anqaData.extractedData?.address?.state || '',
                        AddressCountry: anqaData.extractedData?.address?.country || '',
                        AddressPostCode: anqaData.extractedData?.address?.postcode || ''
                    },
                    // Face matching results for selfies
                    AutomatedFaceMatchResult: anqaData.faceMatch?.success ? "PASSED" : "FAILED",
                    FaceMatchConfidence: anqaData.faceMatch?.confidence || 0,
                    LivenessScore: anqaData.livenessCheck?.score || 0
                },
                // Additional Anqa-specific data
                anqaMetadata: {
                    processingTime: anqaData.processingTime,
                    confidence: anqaData.overallConfidence,
                    version: anqaData.version,
                    timestamp: anqaData.timestamp
                }
            }
        };
    }

    /**
     * Get supported document types
     * @returns {Promise} List of supported document types
     */
    async getSupportedDocuments() {
        try {
            const response = await this.client.get('/supported-documents', this.getHeaders());
            return response.data;
        } catch (error) {
            console.error('Error fetching supported documents:', error);
            return [];
        }
    }

    /**
     * Get OCR processing statistics
     * @returns {Promise} Processing statistics
     */
    async getProcessingStats() {
        try {
            const response = await this.client.get('/stats', this.getHeaders());
            return response.data;
        } catch (error) {
            console.error('Error fetching OCR stats:', error);
            return {};
        }
    }

    /**
     * Validate image before processing
     * @param {string} imageData - Base64 encoded image
     * @returns {Object} Validation result
     */
    validateImage(imageData) {
        const errors = [];
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        if (imageData.length > maxSize) {
            errors.push('Image size exceeds 10MB limit');
        }
        
        // Check format
        if (!imageData.startsWith('data:image/')) {
            errors.push('Invalid image format');
        }
        
        // Check if image is empty
        if (!imageData || imageData.length < 1000) {
            errors.push('Image data is too small or empty');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Optimize image for better OCR processing
     * @param {string} imageData - Base64 encoded image
     * @returns {Promise<string>} Optimized image data
     */
    async optimizeImage(imageData) {
        try {
            // Create canvas for image optimization
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    // Set canvas dimensions
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    // Draw image with optimization
                    ctx.filter = 'contrast(1.2) brightness(1.1)';
                    ctx.drawImage(img, 0, 0);
                    
                    // Convert back to base64 with quality optimization
                    const optimizedData = canvas.toDataURL('image/jpeg', 0.9);
                    resolve(optimizedData);
                };
                
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = imageData;
            });
        } catch (error) {
            console.warn('Image optimization failed, using original:', error);
            return imageData; // Return original if optimization fails
        }
    }

    /**
     * Process request with retry logic
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request data
     * @param {Function} onProgress - Progress callback
     * @returns {Promise} Response
     */
    async processWithRetry(endpoint, data, onProgress) {
        return await this.client.post(endpoint, data, {
            ...this.getHeaders(),
            onUploadProgress: onProgress ? (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
            } : undefined
        });
    }

    /**
     * Set debug mode for enhanced logging
     * @param {boolean} enabled - Whether debug mode is enabled
     */
    setDebugMode(enabled) {
        this.debugMode = enabled;
        if (enabled) {
            console.log('Anqa OCR Service: Debug mode enabled');
        }
    }

    /**
     * Get service health status
     * @returns {Promise<Object>} Health status
     */
    async getHealthStatus() {
        try {
            const response = await this.client.get('/health', this.getHeaders());
            return {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                version: '2025.1.0',
                uptime: process.uptime(),
                ...response.data
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error.message
            };
        }
    }

    /**
     * Batch process multiple documents
     * @param {Array} documents - Array of document processing requests
     * @returns {Promise<Array>} Array of processing results
     */
    async batchProcessDocuments(documents) {
        const results = [];
        const batchSize = 5; // Process 5 documents at a time
        
        for (let i = 0; i < documents.length; i += batchSize) {
            const batch = documents.slice(i, i + batchSize);
            const batchPromises = batch.map(doc => this.processIdDocument(doc));
            
            try {
                const batchResults = await Promise.allSettled(batchPromises);
                results.push(...batchResults);
            } catch (error) {
                console.error(`Batch ${Math.floor(i / batchSize) + 1} failed:`, error);
            }
        }
        
        return results;
    }

    /**
     * Get supported document types and their requirements
     * @returns {Promise<Object>} Document type requirements
     */
    async getDocumentRequirements() {
        try {
            const response = await this.client.get('/document-requirements', this.getHeaders());
            return response.data;
        } catch (error) {
            // Return default requirements if API fails
            return {
                passport: {
                    minResolution: 300,
                    supportedFormats: ['jpeg', 'png'],
                    requiredFields: ['documentNumber', 'firstName', 'lastName', 'birthDate', 'expiryDate']
                },
                driver_license: {
                    minResolution: 250,
                    supportedFormats: ['jpeg', 'png'],
                    requiredFields: ['documentNumber', 'firstName', 'lastName', 'birthDate', 'expiryDate']
                },
                national_id: {
                    minResolution: 250,
                    supportedFormats: ['jpeg', 'png'],
                    requiredFields: ['documentNumber', 'firstName', 'lastName', 'birthDate']
                }
            };
        }
    }
}
