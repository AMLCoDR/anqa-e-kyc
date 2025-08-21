package v2

import (
	"context"
	"crypto/md5"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"log"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/otiai10/gosseract/v2"
	"golang.org/x/time/rate"
)

// EnhancedOCRService handles document processing with Anqa's proprietary OCR
type EnhancedOCRService struct {
	tesseractClient *gosseract.Client
	modelPath       string
	mu              sync.RWMutex
	rateLimiter     *rate.Limiter
	maxConcurrent   int
	semaphore       chan struct{}
	cache           map[string]*CachedResult
	auditLogger     *AuditLogger
}

// CachedResult represents a cached OCR result
type CachedResult struct {
	Result      *DocumentProcessingResult
	ExpiresAt   time.Time
	AccessCount int
}

// DocumentProcessingResult represents the complete OCR processing result
type DocumentProcessingResult struct {
	Success           bool                   `json:"success"`
	ExtractedData     *ExtractedDocumentData `json:"extracted_data"`
	OverallConfidence float64                `json:"overall_confidence"`
	ProcessingTime    int64                  `json:"processing_time"`
	Version           string                 `json:"version"`
	Timestamp         string                 `json:"timestamp"`
	QualityMetrics    *DocumentQuality       `json:"quality_metrics"`
	ValidationResult  *ValidationResult      `json:"validation_result"`
	Language          string                 `json:"language"`
}

// ExtractedDocumentData represents structured document information
type ExtractedDocumentData struct {
	DocumentType   string   `json:"document_type"`
	CountryCode    string   `json:"country_code"`
	CardNumber     string   `json:"card_number"`
	DocumentNumber string   `json:"document_number"`
	FirstName      string   `json:"first_name"`
	MiddleName     string   `json:"middle_name"`
	LastName       string   `json:"last_name"`
	BirthDate      string   `json:"birth_date"`
	ExpiryDate     string   `json:"expiry_date"`
	Gender         string   `json:"gender"`
	Nationality    string   `json:"nationality"`
	Address        *Address `json:"address"`
}

// Address represents address information
type Address struct {
	Line1    string `json:"line1"`
	Line2    string `json:"line2"`
	City     string `json:"city"`
	State    string `json:"state"`
	Country  string `json:"country"`
	Postcode string `json:"postcode"`
}

// DocumentQuality represents document quality metrics
type DocumentQuality struct {
	Resolution   int     `json:"resolution"`
	Brightness   float64 `json:"brightness"`
	Contrast     float64 `json:"contrast"`
	Sharpness    float64 `json:"sharpness"`
	Orientation  string  `json:"orientation"`
	QualityScore float64 `json:"quality_score"`
}

// ValidationResult represents document validation results
type ValidationResult struct {
	IsValid    bool     `json:"is_valid"`
	Confidence float64  `json:"confidence"`
	Issues     []string `json:"issues"`
}

// AuditLog represents audit logging information
type AuditLog struct {
	EntryID        string    `json:"entry_id"`
	UserID         string    `json:"user_id"`
	TenantID       string    `json:"tenant_id"`
	Action         string    `json:"action"`
	Timestamp      time.Time `json:"timestamp"`
	IPAddress      string    `json:"ip_address"`
	UserAgent      string    `json:"user_agent"`
	ProcessingTime int64     `json:"processing_time"`
	Success        bool      `json:"success"`
	ErrorMessage   string    `json:"error_message,omitempty"`
}

// AuditLogger handles audit logging
type AuditLogger struct {
	logs []*AuditLog
	mu   sync.RWMutex
}

// NewAuditLogger creates a new audit logger
func NewAuditLogger() *AuditLogger {
	return &AuditLogger{
		logs: make([]*AuditLog, 0),
	}
}

// Log adds an audit log entry
func (al *AuditLogger) Log(log *AuditLog) {
	al.mu.Lock()
	defer al.mu.Unlock()
	al.logs = append(al.logs, log)

	// Log to console for now (in production, send to logging service)
	log.Printf("AUDIT: %s - %s - %s - %v", log.Action, log.EntryID, log.TenantID, log.Success)
}

// NewEnhancedOCRService creates a new enhanced OCR service instance
func NewEnhancedOCRService() *EnhancedOCRService {
	client := gosseract.NewClient()
	if err := client.SetLanguage("eng"); err != nil {
		log.Printf("Warning: Failed to set language: %v", err)
	}

	if err := client.SetPageSegMode(gosseract.PSM_AUTO); err != nil {
		log.Printf("Warning: Failed to set page seg mode: %v", err)
	}

	if err := client.SetWhitelist("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 -.,/()"); err != nil {
		log.Printf("Warning: Failed to set whitelist: %v", err)
	}

	return &EnhancedOCRService{
		tesseractClient: client,
		modelPath:       "./models",
		rateLimiter:     rate.NewLimiter(rate.Every(100*time.Millisecond), 10), // 10 requests per second
		maxConcurrent:   5,
		semaphore:       make(chan struct{}, 5),
		cache:           make(map[string]*CachedResult),
		auditLogger:     NewAuditLogger(),
	}
}

// Close properly closes the OCR service
func (s *EnhancedOCRService) Close() {
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.tesseractClient != nil {
		s.tesseractClient.Close()
	}
}

// ProcessDocument processes an ID document with enhanced OCR capabilities
func (s *EnhancedOCRService) ProcessDocument(ctx context.Context, req *DocumentProcessingRequest) (*DocumentProcessingResult, error) {
	startTime := time.Now()

	// Rate limiting
	if !s.rateLimiter.Allow() {
		return nil, fmt.Errorf("rate limit exceeded")
	}

	// Concurrency control
	select {
	case s.semaphore <- struct{}{}:
		defer func() { <-s.semaphore }()
	case <-ctx.Done():
		return nil, fmt.Errorf("request cancelled")
	}

	// Input validation
	if err := s.validateRequest(req); err != nil {
		return nil, fmt.Errorf("validation failed: %v", err)
	}

	// Check cache first
	cacheKey := s.generateCacheKey(req)
	if cached, found := s.getFromCache(cacheKey); found {
		s.logAuditEvent(ctx, req, cached, nil, time.Since(startTime).Milliseconds())
		return cached, nil
	}

	// Decode base64 image
	imageData, err := base64.StdEncoding.DecodeString(req.ImageData)
	if err != nil {
		return nil, fmt.Errorf("invalid image data: %v", err)
	}

	// Assess document quality
	qualityMetrics, err := s.assessDocumentQuality(imageData)
	if err != nil {
		log.Printf("Warning: Quality assessment failed: %v", err)
		qualityMetrics = &DocumentQuality{QualityScore: 0.5}
	}

	// Detect language
	detectedLang, err := s.detectLanguage(imageData)
	if err != nil {
		detectedLang = "eng" // fallback
	}

	// Set language for OCR
	s.mu.RLock()
	if err := s.tesseractClient.SetLanguage(detectedLang); err != nil {
		log.Printf("Warning: Failed to set language %s: %v", detectedLang, err)
	}
	s.mu.RUnlock()

	// Process image with OCR
	extractedData, err := s.extractTextFromImage(imageData, req.ImageFormat)
	if err != nil {
		return nil, fmt.Errorf("OCR processing failed: %v", err)
	}

	// Parse extracted text into structured data
	parsedData, err := s.parseDocumentData(extractedData, req.DocumentType)
	if err != nil {
		log.Printf("Warning: Document parsing failed, using raw extraction: %v", err)
		parsedData = s.createFallbackData(extractedData)
	}

	// Validate document authenticity
	validationResult := s.validateDocument(parsedData, extractedData, qualityMetrics)

	processingTime := time.Since(startTime).Milliseconds()

	response := &DocumentProcessingResult{
		Success: validationResult.IsValid,
		ExtractedData: &ExtractedDocumentData{
			DocumentType:   parsedData.DocumentType,
			CountryCode:    parsedData.CountryCode,
			CardNumber:     parsedData.CardNumber,
			DocumentNumber: parsedData.DocumentNumber,
			FirstName:      parsedData.FirstName,
			MiddleName:     parsedData.MiddleName,
			LastName:       parsedData.LastName,
			BirthDate:      parsedData.BirthDate,
			ExpiryDate:     parsedData.ExpiryDate,
			Gender:         parsedData.Gender,
			Nationality:    parsedData.Nationality,
			Address: &Address{
				Line1:    parsedData.Address.Line1,
				Line2:    parsedData.Address.Line2,
				City:     parsedData.Address.City,
				State:    parsedData.Address.State,
				Country:  parsedData.Address.Country,
				Postcode: parsedData.Address.Postcode,
			},
		},
		OverallConfidence: validationResult.Confidence,
		ProcessingTime:    processingTime,
		Version:           "2025.1.0",
		Timestamp:         time.Now().Format(time.RFC3339),
		QualityMetrics:    qualityMetrics,
		ValidationResult:  validationResult,
		Language:          detectedLang,
	}

	// Cache result
	s.addToCache(cacheKey, response)

	// Log audit event
	s.logAuditEvent(ctx, req, response, nil, processingTime)

	return response, nil
}

// DocumentProcessingRequest represents the request for document processing
type DocumentProcessingRequest struct {
	EntryID           string             `json:"entry_id"`
	DocumentType      string             `json:"document_type"`
	ImageData         string             `json:"image_data"`
	ImageFormat       string             `json:"image_format"`
	ProcessingOptions *ProcessingOptions `json:"processing_options"`
	Metadata          map[string]string  `json:"metadata"`
}

// ProcessingOptions represents processing configuration
type ProcessingOptions struct {
	ExtractText          bool    `json:"extract_text"`
	ExtractFields        bool    `json:"extract_fields"`
	ValidateDocument     bool    `json:"validate_document"`
	PerformLivenessCheck bool    `json:"perform_liveness_check"`
	ConfidenceThreshold  float64 `json:"confidence_threshold"`
}

// validateRequest validates the processing request
func (s *EnhancedOCRService) validateRequest(req *DocumentProcessingRequest) error {
	if req.EntryID == "" {
		return fmt.Errorf("entry ID is required")
	}

	if len(req.ImageData) > 10*1024*1024 { // 10MB limit
		return fmt.Errorf("image size exceeds 10MB limit")
	}

	if !s.isValidImageFormat(req.ImageFormat) {
		return fmt.Errorf("unsupported image format: %s", req.ImageFormat)
	}

	return nil
}

// isValidImageFormat checks if the image format is supported
func (s *EnhancedOCRService) isValidImageFormat(format string) bool {
	supportedFormats := []string{"jpeg", "jpg", "png"}
	for _, f := range supportedFormats {
		if strings.ToLower(format) == f {
			return true
		}
	}
	return false
}

// generateCacheKey generates a cache key for the request
func (s *EnhancedOCRService) generateCacheKey(req *DocumentProcessingRequest) string {
	hash := md5.Sum([]byte(req.EntryID + req.ImageData))
	return hex.EncodeToString(hash[:])
}

// getFromCache retrieves a result from cache
func (s *EnhancedOCRService) getFromCache(key string) (*DocumentProcessingResult, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if cached, found := s.cache[key]; found && time.Now().Before(cached.ExpiresAt) {
		cached.AccessCount++
		return cached.Result, true
	}

	return nil, false
}

// addToCache adds a result to cache
func (s *EnhancedOCRService) addToCache(key string, result *DocumentProcessingResult) {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.cache[key] = &CachedResult{
		Result:    result,
		ExpiresAt: time.Now().Add(24 * time.Hour), // Cache for 24 hours
	}

	// Clean up old cache entries
	s.cleanupCache()
}

// cleanupCache removes expired cache entries
func (s *EnhancedOCRService) cleanupCache() {
	now := time.Now()
	for key, cached := range s.cache {
		if now.After(cached.ExpiresAt) {
			delete(s.cache, key)
		}
	}
}

// assessDocumentQuality assesses the quality of the document image
func (s *EnhancedOCRService) assessDocumentQuality(imageData []byte) (*DocumentQuality, error) {
	// This is a simplified quality assessment
	// In production, use sophisticated image processing libraries

	quality := &DocumentQuality{
		QualityScore: 0.8, // Default score
	}

	// Basic quality metrics based on image size
	if len(imageData) > 500000 { // > 500KB
		quality.QualityScore = 0.9
		quality.Resolution = 300
	} else if len(imageData) > 200000 { // > 200KB
		quality.QualityScore = 0.8
		quality.Resolution = 200
	} else {
		quality.QualityScore = 0.6
		quality.Resolution = 150
	}

	return quality, nil
}

// detectLanguage detects the language of the document
func (s *EnhancedOCRService) detectLanguage(imageData []byte) (string, error) {
	// Simplified language detection
	// In production, use language detection libraries

	// For now, return English as default
	return "eng", nil
}

// extractTextFromImage performs OCR on the provided image
func (s *EnhancedOCRService) extractTextFromImage(imageData []byte, format string) (string, error) {
	// Create temporary file
	tempFile, err := os.CreateTemp("", "ocr_image_*")
	if err != nil {
		return "", fmt.Errorf("failed to create temp file: %v", err)
	}
	defer os.Remove(tempFile.Name())

	// Write image data to temp file
	if _, err := tempFile.Write(imageData); err != nil {
		return "", fmt.Errorf("failed to write image data: %v", err)
	}
	tempFile.Close()

	// Set image path for Tesseract
	s.mu.RLock()
	s.tesseractClient.SetImage(tempFile.Name())
	text, err := s.tesseractClient.Text()
	s.mu.RUnlock()

	if err != nil {
		return "", fmt.Errorf("tesseract OCR failed: %v", err)
	}

	return text, nil
}

// parseDocumentData parses extracted text into structured data
func (s *EnhancedOCRService) parseDocumentData(rawText, documentType string) (*ExtractedDocumentData, error) {
	data := &ExtractedDocumentData{}

	// Basic text cleaning
	cleanText := strings.ReplaceAll(rawText, "\n", " ")
	cleanText = strings.ReplaceAll(cleanText, "\r", " ")

	// Extract common patterns
	data.DocumentType = s.extractDocumentType(cleanText, documentType)
	data.CountryCode = s.extractCountryCode(cleanText)
	data.DocumentNumber = s.extractDocumentNumber(cleanText)
	data.FirstName = s.extractFirstName(cleanText)
	data.LastName = s.extractLastName(cleanText)
	data.BirthDate = s.extractBirthDate(cleanText)
	data.ExpiryDate = s.extractExpiryDate(cleanText)

	return data, nil
}

// Helper methods for data extraction (same as before)
func (s *EnhancedOCRService) extractDocumentType(text, requestedType string) string {
	if requestedType != "auto-detect" {
		return requestedType
	}

	text = strings.ToLower(text)
	if strings.Contains(text, "passport") {
		return "PASSPORT"
	} else if strings.Contains(text, "driver") || strings.Contains(text, "license") {
		return "DRIVER_LICENSE"
	} else if strings.Contains(text, "national") && strings.Contains(text, "id") {
		return "NATIONAL_ID"
	}
	return "UNKNOWN"
}

func (s *EnhancedOCRService) extractCountryCode(text string) string {
	text = strings.ToUpper(text)
	if strings.Contains(text, "USA") || strings.Contains(text, "UNITED STATES") {
		return "US"
	} else if strings.Contains(text, "GBR") || strings.Contains(text, "UNITED KINGDOM") {
		return "GB"
	} else if strings.Contains(text, "CAN") || strings.Contains(text, "CANADA") {
		return "CA"
	}
	return "UNKNOWN"
}

func (s *EnhancedOCRService) extractDocumentNumber(text string) string {
	words := strings.Fields(text)
	for _, word := range words {
		if len(word) >= 6 && len(word) <= 15 {
			hasLetter := false
			hasNumber := false
			for _, char := range word {
				if char >= 'A' && char <= 'Z' || char >= 'a' && char <= 'z' {
					hasLetter = true
				} else if char >= '0' && char <= '9' {
					hasNumber = true
				}
			}
			if hasLetter && hasNumber {
				return word
			}
		}
	}
	return ""
}

func (s *EnhancedOCRService) extractFirstName(text string) string {
	words := strings.Fields(text)
	for i, word := range words {
		if len(word) > 2 && word[0] >= 'A' && word[0] <= 'Z' {
			if i > 0 && (strings.Contains(strings.ToLower(words[i-1]), "first") ||
				strings.Contains(strings.ToLower(words[i-1]), "given")) {
				return word
			}
		}
	}
	return ""
}

func (s *EnhancedOCRService) extractLastName(text string) string {
	words := strings.Fields(text)
	for i, word := range words {
		if len(word) > 2 && word[0] >= 'A' && word[0] <= 'Z' {
			if i > 0 && (strings.Contains(strings.ToLower(words[i-1]), "last") ||
				strings.Contains(strings.ToLower(words[i-1]), "family")) {
				return word
			}
		}
	}
	return ""
}

func (s *EnhancedOCRService) extractBirthDate(text string) string {
	words := strings.Fields(text)
	for _, word := range words {
		if strings.Contains(word, "/") || strings.Contains(word, "-") || strings.Contains(word, ".") {
			if len(word) >= 8 && len(word) <= 10 {
				return word
			}
		}
	}
	return ""
}

func (s *EnhancedOCRService) extractExpiryDate(text string) string {
	return s.extractBirthDate(text)
}

// createFallbackData creates basic data structure when parsing fails
func (s *EnhancedOCRService) createFallbackData(rawText string) *ExtractedDocumentData {
	return &ExtractedDocumentData{
		DocumentType:   "UNKNOWN",
		CountryCode:    "UNKNOWN",
		DocumentNumber: "",
		FirstName:      "",
		MiddleName:     "",
		LastName:       "",
		BirthDate:      "",
		ExpiryDate:     "",
		Gender:         "",
		Nationality:    "",
		Address:        &Address{},
	}
}

// validateDocument performs enhanced document validation
func (s *EnhancedOCRService) validateDocument(parsedData *ExtractedDocumentData, rawText string, quality *DocumentQuality) *ValidationResult {
	confidence := 0.0
	issues := []string{}

	// Check if we extracted meaningful data
	if parsedData.DocumentNumber != "" {
		confidence += 0.3
	}
	if parsedData.FirstName != "" {
		confidence += 0.2
	}
	if parsedData.LastName != "" {
		confidence += 0.2
	}
	if parsedData.BirthDate != "" {
		confidence += 0.15
	}
	if parsedData.ExpiryDate != "" {
		confidence += 0.15
	}

	// Quality-based adjustments
	if quality != nil {
		if quality.QualityScore < 0.6 {
			issues = append(issues, "Low image quality")
			confidence -= 0.2
		} else if quality.QualityScore > 0.8 {
			confidence += 0.1
		}
	}

	// Check for potential issues
	if len(rawText) < 50 {
		issues = append(issues, "Low text extraction")
		confidence -= 0.2
	}

	if confidence < 0 {
		confidence = 0
	}

	return &ValidationResult{
		IsValid:    confidence > 0.5,
		Confidence: confidence,
		Issues:     issues,
	}
}

// logAuditEvent logs audit information
func (s *EnhancedOCRService) logAuditEvent(ctx context.Context, req *DocumentProcessingRequest, response *DocumentProcessingResult, err error, processingTime int64) {
	auditLog := &AuditLog{
		EntryID:        req.EntryID,
		UserID:         "system",  // Extract from context in production
		TenantID:       "default", // Extract from context in production
		Action:         "document_ocr_processing",
		Timestamp:      time.Now(),
		IPAddress:      "localhost",        // Extract from context in production
		UserAgent:      "anqa-ocr-service", // Extract from context in production
		ProcessingTime: processingTime,
		Success:        response.Success,
	}

	if err != nil {
		auditLog.ErrorMessage = err.Error()
	}

	s.auditLogger.Log(auditLog)
}
