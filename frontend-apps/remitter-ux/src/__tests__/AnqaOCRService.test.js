import { AnqaOCRService } from '../Services/AnqaOCRService';
import { OCR_CONFIG, getDocumentTypeConfig, validateConfig } from '../config/ocr.config';

// Mock axios
jest.mock('axios');
const axios = require('axios');

describe('AnqaOCRService', () => {
    let ocrService;
    let mockAxios;

    beforeEach(() => {
        ocrService = new AnqaOCRService();
        mockAxios = {
            create: jest.fn(() => ({
                post: jest.fn(),
                get: jest.fn(),
            })),
        };
        axios.create = mockAxios.create;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Constructor and Configuration', () => {
        test('should initialize with default configuration', () => {
            expect(ocrService.maxRetries).toBe(3);
            expect(ocrService.retryDelay).toBe(1000);
            expect(ocrService.debugMode).toBe(false);
        });

        test('should create axios client with correct base URL', () => {
            expect(mockAxios.create).toHaveBeenCalledWith({
                baseURL: 'http://localhost:8080/api/ocr',
                timeout: 30000,
            });
        });
    });

    describe('Image Validation', () => {
        test('should validate correct image data', () => {
            const validImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
            
            const result = ocrService.validateImage(validImage);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('should reject oversized images', () => {
            const oversizedImage = 'data:image/jpeg;base64,' + 'A'.repeat(11 * 1024 * 1024);
            
            const result = ocrService.validateImage(oversizedImage);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Image size exceeds 10MB limit');
        });

        test('should reject invalid image format', () => {
            const invalidImage = 'invalid:image:format';
            
            const result = ocrService.validateImage(invalidImage);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Invalid image format');
        });

        test('should reject empty image data', () => {
            const emptyImage = '';
            
            const result = ocrService.validateImage(emptyImage);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Image data is too small or empty');
        });
    });

    describe('Document Processing', () => {
        test('should process document successfully', async () => {
            const mockResponse = {
                data: {
                    success: true,
                    extractedData: {
                        documentType: 'PASSPORT',
                        firstName: 'John',
                        lastName: 'Doe',
                        documentNumber: '123456789',
                    },
                    overallConfidence: 0.95,
                },
            };

            const mockClient = {
                post: jest.fn().mockResolvedValue(mockResponse),
            };
            ocrService.client = mockClient;

            const result = await ocrService.processIdDocument({
                entryId: 'test-123',
                image: 'data:image/jpeg;base64,test',
                documentType: 'passport',
            });

            expect(result.data.ExtractedData.DocumentType).toBe('PASSPORT');
            expect(result.data.ExtractedData.ExtractedFields.FirstName).toBe('John');
        });

        test('should handle processing errors gracefully', async () => {
            const mockClient = {
                post: jest.fn().mockRejectedValue(new Error('Network error')),
            };
            ocrService.client = mockClient;

            await expect(ocrService.processIdDocument({
                entryId: 'test-123',
                image: 'data:image/jpeg;base64,test',
            })).rejects.toThrow('OCR processing failed: Network error');
        });

        test('should validate input before processing', async () => {
            await expect(ocrService.processIdDocument({
                entryId: '',
                image: 'data:image/jpeg;base64,test',
            })).rejects.toThrow('OCR processing failed: validation failed: entry ID is required');
        });
    });

    describe('Retry Logic', () => {
        test('should retry failed requests', async () => {
            const mockClient = {
                post: jest.fn()
                    .mockRejectedValueOnce(new Error('First attempt failed'))
                    .mockRejectedValueOnce(new Error('Second attempt failed'))
                    .mockResolvedValueOnce({ data: { success: true } }),
            };
            ocrService.client = mockClient;

            const result = await ocrService.processIdDocumentWithRetry({
                entryId: 'test-123',
                image: 'data:image/jpeg;base64,test',
            });

            expect(mockClient.post).toHaveBeenCalledTimes(3);
            expect(result.data.success).toBe(true);
        });

        test('should fallback to lower confidence threshold after max retries', async () => {
            const mockClient = {
                post: jest.fn()
                    .mockRejectedValue(new Error('All attempts failed')),
            };
            ocrService.client = mockClient;

            // Mock the fallback method
            ocrService.processIdDocumentFallback = jest.fn().mockResolvedValue({
                data: { success: true, confidence: 0.6 },
            });

            await ocrService.processIdDocumentWithRetry({
                entryId: 'test-123',
                image: 'data:image/jpeg;base64,test',
            });

            expect(ocrService.processIdDocumentFallback).toHaveBeenCalled();
        });
    });

    describe('Batch Processing', () => {
        test('should process multiple documents in batches', async () => {
            const documents = [
                { entryId: 'doc1', image: 'data:image/jpeg;base64,test1' },
                { entryId: 'doc2', image: 'data:image/jpeg;base64,test2' },
                { entryId: 'doc3', image: 'data:image/jpeg;base64,test3' },
            ];

            // Mock the processIdDocument method
            ocrService.processIdDocument = jest.fn().mockResolvedValue({
                data: { success: true },
            });

            const results = await ocrService.batchProcessDocuments(documents);

            expect(ocrService.processIdDocument).toHaveBeenCalledTimes(3);
            expect(results).toHaveLength(3);
        });

        test('should handle batch processing errors gracefully', async () => {
            const documents = [
                { entryId: 'doc1', image: 'data:image/jpeg;base64,test1' },
                { entryId: 'doc2', image: 'data:image/jpeg;base64,test2' },
            ];

            ocrService.processIdDocument = jest.fn()
                .mockResolvedValueOnce({ data: { success: true } })
                .mockRejectedValueOnce(new Error('Processing failed'));

            const results = await ocrService.batchProcessDocuments(documents);

            expect(results).toHaveLength(2);
            expect(results[0].status).toBe('fulfilled');
            expect(results[1].status).toBe('rejected');
        });
    });

    describe('Service Health', () => {
        test('should return healthy status when service is available', async () => {
            const mockClient = {
                get: jest.fn().mockResolvedValue({
                    data: { status: 'ok', uptime: 3600 },
                }),
            };
            ocrService.client = mockClient;

            const health = await ocrService.getHealthStatus();

            expect(health.status).toBe('healthy');
            expect(health.version).toBe('2025.1.0');
        });

        test('should return unhealthy status when service is unavailable', async () => {
            const mockClient = {
                get: jest.fn().mockRejectedValue(new Error('Service unavailable')),
            };
            ocrService.client = mockClient;

            const health = await ocrService.getHealthStatus();

            expect(health.status).toBe('unhealthy');
            expect(health.error).toBe('Service unavailable');
        });
    });

    describe('Configuration Management', () => {
        test('should get document type configuration', () => {
            const passportConfig = getDocumentTypeConfig('passport');
            expect(passportConfig.name).toBe('Passport');
            expect(passportConfig.minResolution).toBe(300);
            expect(passportConfig.requiredFields).toContain('documentNumber');
        });

        test('should return default config for unknown document type', () => {
            const unknownConfig = getDocumentTypeConfig('unknown_type');
            expect(unknownConfig.name).toBe('Passport'); // Default fallback
        });

        test('should validate configuration correctly', () => {
            const validation = validateConfig();
            expect(validation.isValid).toBe(false); // Should fail without env var
            expect(validation.errors).toContain('REACT_APP_ANQA_OCR_URL is not set');
        });
    });

    describe('Debug Mode', () => {
        test('should enable debug mode', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            ocrService.setDebugMode(true);
            
            expect(ocrService.debugMode).toBe(true);
            expect(consoleSpy).toHaveBeenCalledWith('Anqa OCR Service: Debug mode enabled');
            
            consoleSpy.mockRestore();
        });

        test('should disable debug mode', () => {
            ocrService.setDebugMode(false);
            expect(ocrService.debugMode).toBe(false);
        });
    });

    describe('Error Handling', () => {
        test('should handle network timeouts', async () => {
            const mockClient = {
                post: jest.fn().mockRejectedValue(new Error('timeout of 30000ms exceeded')),
            };
            ocrService.client = mockClient;

            await expect(ocrService.processIdDocument({
                entryId: 'test-123',
                image: 'data:image/jpeg;base64,test',
            })).rejects.toThrow('OCR processing failed: timeout of 30000ms exceeded');
        });

        test('should handle malformed responses', async () => {
            const mockResponse = {
                data: null, // Malformed response
            };

            const mockClient = {
                post: jest.fn().mockResolvedValue(mockResponse),
            };
            ocrService.client = mockClient;

            await expect(ocrService.processIdDocument({
                entryId: 'test-123',
                image: 'data:image/jpeg;base64,test',
            })).rejects.toThrow();
        });
    });

    describe('Performance Optimization', () => {
        test('should optimize images before processing', async () => {
            // Mock canvas and image APIs
            global.document = {
                createElement: jest.fn(() => ({
                    getContext: jest.fn(() => ({
                        filter: '',
                        drawImage: jest.fn(),
                    })),
                    toDataURL: jest.fn(() => 'data:image/jpeg;base64,optimized'),
                    width: 800,
                    height: 600,
                })),
            };

            global.Image = jest.fn(() => ({
                onload: null,
                onerror: null,
                src: '',
            }));

            const originalImage = 'data:image/jpeg;base64,original';
            const optimizedImage = await ocrService.optimizeImage(originalImage);

            expect(optimizedImage).toBe('data:image/jpeg;base64,optimized');
        });

        test('should fallback to original image if optimization fails', async () => {
            // Mock canvas creation failure
            global.document = {
                createElement: jest.fn(() => {
                    throw new Error('Canvas not supported');
                }),
            };

            const originalImage = 'data:image/jpeg;base64,original';
            const result = await ocrService.optimizeImage(originalImage);

            expect(result).toBe(originalImage);
        });
    });
});
