/**
 * Anqa OCR Service Configuration
 * Centralized configuration for all OCR-related settings
 */

export const OCR_CONFIG = {
    // Service Configuration
    service: {
        baseURL: process.env.REACT_APP_ANQA_OCR_URL || 'http://localhost:8080/api/ocr',
        timeout: 30000, // 30 seconds
        maxRetries: 3,
        retryDelay: 1000, // 1 second
        batchSize: 5,
    },

    // Processing Options
    processing: {
        defaultConfidenceThreshold: 0.8,
        fallbackConfidenceThreshold: 0.6,
        maxImageSize: 10 * 1024 * 1024, // 10MB
        supportedFormats: ['jpeg', 'jpg', 'png'],
        minImageQuality: 0.6,
        enableImageOptimization: true,
        enableLanguageDetection: true,
    },

    // Document Types and Requirements
    documentTypes: {
        passport: {
            name: 'Passport',
            minResolution: 300,
            supportedFormats: ['jpeg', 'png'],
            requiredFields: ['documentNumber', 'firstName', 'lastName', 'birthDate', 'expiryDate'],
            confidenceThreshold: 0.85,
            processingTime: 5000, // 5 seconds
        },
        driver_license: {
            name: 'Driver License',
            minResolution: 250,
            supportedFormats: ['jpeg', 'png'],
            requiredFields: ['documentNumber', 'firstName', 'lastName', 'birthDate', 'expiryDate'],
            confidenceThreshold: 0.8,
            processingTime: 4000, // 4 seconds
        },
        national_id: {
            name: 'National ID',
            minResolution: 250,
            supportedFormats: ['jpeg', 'png'],
            requiredFields: ['documentNumber', 'firstName', 'lastName', 'birthDate'],
            confidenceThreshold: 0.8,
            processingTime: 4000, // 4 seconds
        },
        residence_permit: {
            name: 'Residence Permit',
            minResolution: 250,
            supportedFormats: ['jpeg', 'png'],
            requiredFields: ['documentNumber', 'firstName', 'lastName', 'birthDate', 'expiryDate'],
            confidenceThreshold: 0.8,
            processingTime: 4000, // 4 seconds
        },
        military_id: {
            name: 'Military ID',
            minResolution: 250,
            supportedFormats: ['jpeg', 'png'],
            requiredFields: ['documentNumber', 'firstName', 'lastName', 'birthDate'],
            confidenceThreshold: 0.8,
            processingTime: 4000, // 4 seconds
        },
        student_id: {
            name: 'Student ID',
            minResolution: 200,
            supportedFormats: ['jpeg', 'png'],
            requiredFields: ['documentNumber', 'firstName', 'lastName'],
            confidenceThreshold: 0.75,
            processingTime: 3000, // 3 seconds
        },
    },

    // Quality Assessment
    quality: {
        resolution: {
            excellent: 300,
            good: 250,
            acceptable: 200,
            poor: 150,
        },
        brightness: {
            min: 0.3,
            max: 0.9,
            optimal: 0.6,
        },
        contrast: {
            min: 0.4,
            max: 0.8,
            optimal: 0.6,
        },
        sharpness: {
            min: 0.5,
            max: 1.0,
            optimal: 0.8,
        },
    },

    // Validation Rules
    validation: {
        documentNumber: {
            minLength: 6,
            maxLength: 15,
            pattern: /^[A-Za-z0-9\-]+$/,
        },
        names: {
            minLength: 2,
            maxLength: 50,
            pattern: /^[A-Za-z\s\-']+$/,
        },
        dates: {
            pattern: /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$|^\d{2}-\d{2}-\d{4}$/,
            minYear: 1900,
            maxYear: new Date().getFullYear() + 10,
        },
        countryCodes: {
            pattern: /^[A-Z]{2}$/,
            supported: ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'JP', 'CN', 'IN', 'BR', 'MX', 'KE', 'NG', 'ZA'],
        },
    },

    // Error Messages
    errors: {
        imageTooLarge: 'Image size exceeds the maximum allowed size of 10MB',
        unsupportedFormat: 'Unsupported image format. Please use JPEG, JPG, or PNG',
        imageTooSmall: 'Image is too small for processing. Please use a higher resolution image',
        processingFailed: 'Document processing failed. Please try again with a clearer image',
        validationFailed: 'Document validation failed. Please check the image quality and try again',
        networkError: 'Network error occurred. Please check your connection and try again',
        timeoutError: 'Processing timed out. Please try again',
        retryExceeded: 'Maximum retry attempts exceeded. Please contact support',
    },

    // Success Messages
    success: {
        documentProcessed: 'Document processed successfully',
        fieldsExtracted: 'All required fields extracted successfully',
        highConfidence: 'High confidence extraction completed',
        qualityGood: 'Document quality is good for processing',
    },

    // Performance Settings
    performance: {
        enableCaching: true,
        cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours
        enableCompression: true,
        compressionQuality: 0.9,
        enableProgressiveProcessing: true,
        chunkSize: 1024 * 1024, // 1MB chunks
    },

    // Security Settings
    security: {
        enableEncryption: true,
        encryptionAlgorithm: 'AES-256',
        enableAuditLogging: true,
        enableRateLimiting: true,
        maxRequestsPerMinute: 60,
        enableInputSanitization: true,
    },

    // Monitoring and Analytics
    monitoring: {
        enableMetrics: true,
        enablePerformanceTracking: true,
        enableErrorTracking: true,
        enableUserAnalytics: true,
        logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    },

    // Localization
    localization: {
        defaultLanguage: 'en',
        supportedLanguages: ['en', 'es', 'fr', 'de', 'ar', 'zh', 'ja', 'ko'],
        dateFormats: {
            en: 'MM/DD/YYYY',
            es: 'DD/MM/YYYY',
            fr: 'DD/MM/YYYY',
            de: 'DD.MM.YYYY',
            ar: 'DD/MM/YYYY',
            zh: 'YYYY-MM-DD',
            ja: 'YYYY-MM-DD',
            ko: 'YYYY-MM-DD',
        },
    },
};

/**
 * Get configuration for a specific document type
 * @param {string} documentType - The document type
 * @returns {Object} Document type configuration
 */
export const getDocumentTypeConfig = (documentType) => {
    return OCR_CONFIG.documentTypes[documentType] || OCR_CONFIG.documentTypes.passport;
};

/**
 * Validate configuration values
 * @returns {Object} Validation result
 */
export const validateConfig = () => {
    const errors = [];
    
    // Check required environment variables
    if (!process.env.REACT_APP_ANQA_OCR_URL) {
        errors.push('REACT_APP_ANQA_OCR_URL is not set');
    }
    
    // Check configuration values
    if (OCR_CONFIG.processing.maxImageSize <= 0) {
        errors.push('Invalid max image size configuration');
    }
    
    if (OCR_CONFIG.processing.defaultConfidenceThreshold < 0 || OCR_CONFIG.processing.defaultConfidenceThreshold > 1) {
        errors.push('Invalid confidence threshold configuration');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Get optimized processing options for a document type
 * @param {string} documentType - The document type
 * @param {Object} customOptions - Custom processing options
 * @returns {Object} Optimized processing options
 */
export const getOptimizedProcessingOptions = (documentType, customOptions = {}) => {
    const docConfig = getDocumentTypeConfig(documentType);
    
    return {
        extractText: true,
        extractFields: true,
        validateDocument: true,
        performLivenessCheck: false,
        confidenceThreshold: customOptions.confidenceThreshold || docConfig.confidenceThreshold,
        imageQuality: customOptions.imageQuality || OCR_CONFIG.processing.minImageQuality,
        enableOptimization: customOptions.enableOptimization ?? OCR_CONFIG.processing.enableImageOptimization,
        language: customOptions.language || OCR_CONFIG.localization.defaultLanguage,
        ...customOptions,
    };
};

export default OCR_CONFIG;
