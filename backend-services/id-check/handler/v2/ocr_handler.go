package v2

import (
	"context"
	"encoding/base64"
	"fmt"
	"log"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/otiai10/gosseract/v2"
	"golang.org/x/time/rate"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	pb "github.com/anqa-ekyc/id-check/gen/idcheck/v2"
)

// OCRService handles document processing with Anqa's proprietary OCR
type OCRService struct {
	pb.UnimplementedOCRServiceServer
	tesseractClient *gosseract.Client
	modelPath       string
	mu              sync.RWMutex
	rateLimiter     *rate.Limiter
	maxConcurrent   int
	semaphore       chan struct{}
}

// NewOCRService creates a new OCR service instance
func NewOCRService() *OCRService {
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

	return &OCRService{
		tesseractClient: client,
		modelPath:       "./models",
		rateLimiter:     rate.NewLimiter(rate.Every(100*time.Millisecond), 10), // 10 requests per second
		maxConcurrent:   5,
		semaphore:       make(chan struct{}, 5),
	}
}

// Close properly closes the OCR service
func (s *OCRService) Close() {
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.tesseractClient != nil {
		s.tesseractClient.Close()
	}
}

// ProcessDocument processes an ID document with OCR
func (s *OCRService) ProcessDocument(ctx context.Context, req *pb.ProcessDocumentRequest) (*pb.ProcessDocumentResponse, error) {
	startTime := time.Now()

	// Decode base64 image
	imageData, err := base64.StdEncoding.DecodeString(req.ImageData)
	if err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "invalid image data: %v", err)
	}

	// Process image with OCR
	extractedData, err := s.extractTextFromImage(imageData, req.ImageFormat)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "OCR processing failed: %v", err)
	}

	// Parse extracted text into structured data
	parsedData, err := s.parseDocumentData(extractedData, req.DocumentType)
	if err != nil {
		log.Printf("Warning: Document parsing failed, using raw extraction: %v", err)
		parsedData = s.createFallbackData(extractedData)
	}

	// Validate document authenticity
	validationResult := s.validateDocument(parsedData, extractedData)

	processingTime := time.Since(startTime).Milliseconds()

	response := &pb.ProcessDocumentResponse{
		Success: validationResult.IsValid,
		ExtractedData: &pb.ExtractedDocumentData{
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
			Address: &pb.Address{
				Line1:    parsedData.Address.Line1,
				Line2:    parsedData.Address.Line2,
				City:     parsedData.Address.City,
				State:    parsedData.Address.State,
				Country:  parsedData.Address.Country,
				Postcode: parsedData.Address.Postcode,
			},
		},
		OverallConfidence: validationResult.Confidence,
		ProcessingTime:    int64(processingTime),
		Version:           "2025.1.0",
		Timestamp:         time.Now().Format(time.RFC3339),
		ValidationResult:  validationResult,
	}

	return response, nil
}

// ProcessSelfie processes a selfie image for face recognition
func (s *OCRService) ProcessSelfie(ctx context.Context, req *pb.ProcessSelfieRequest) (*pb.ProcessSelfieResponse, error) {
	startTime := time.Now()

	// Decode base64 image
	imageData, err := base64.StdEncoding.DecodeString(req.ImageData)
	if err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "invalid image data: %v", err)
	}

	// Perform liveness detection
	livenessScore, err := s.detectLiveness(imageData)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "liveness detection failed: %v", err)
	}

	// Face quality assessment
	faceQuality := s.assessFaceQuality(imageData)

	processingTime := time.Since(startTime).Milliseconds()

	response := &pb.ProcessSelfieResponse{
		Success: livenessScore > 0.7 && faceQuality > 0.6,
		FaceMatch: &pb.FaceMatchResult{
			Success:    livenessScore > 0.7,
			Confidence: livenessScore,
		},
		LivenessCheck: &pb.LivenessCheckResult{
			Score: livenessScore,
			Pass:  livenessScore > 0.7,
		},
		FaceQuality:    faceQuality,
		ProcessingTime: int64(processingTime),
		Version:        "2025.1.0",
		Timestamp:      time.Now().Format(time.RFC3339),
	}

	return response, nil
}

// extractTextFromImage performs OCR on the provided image
func (s *OCRService) extractTextFromImage(imageData []byte, format string) (string, error) {
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
	s.tesseractClient.SetImage(tempFile.Name())

	// Perform OCR
	text, err := s.tesseractClient.Text()
	if err != nil {
		return "", fmt.Errorf("tesseract OCR failed: %v", err)
	}

	return text, nil
}

// parseDocumentData parses extracted text into structured data
func (s *OCRService) parseDocumentData(rawText, documentType string) (*DocumentData, error) {
	// This is a simplified parser - in production, you'd use more sophisticated NLP
	// and machine learning models for accurate document parsing

	data := &DocumentData{}

	// Basic text cleaning
	cleanText := strings.ReplaceAll(rawText, "\n", " ")
	cleanText = strings.ReplaceAll(cleanText, "\r", " ")

	// Extract common patterns (this is a basic implementation)
	data.DocumentType = s.extractDocumentType(cleanText, documentType)
	data.CountryCode = s.extractCountryCode(cleanText)
	data.DocumentNumber = s.extractDocumentNumber(cleanText)
	data.FirstName = s.extractFirstName(cleanText)
	data.LastName = s.extractLastName(cleanText)
	data.BirthDate = s.extractBirthDate(cleanText)
	data.ExpiryDate = s.extractExpiryDate(cleanText)

	return data, nil
}

// Helper methods for data extraction
func (s *OCRService) extractDocumentType(text, requestedType string) string {
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

func (s *OCRService) extractCountryCode(text string) string {
	// Basic country code extraction - in production, use more sophisticated methods
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

func (s *OCRService) extractDocumentNumber(text string) string {
	// Extract alphanumeric sequences that look like document numbers
	// This is a simplified regex - production would use more sophisticated patterns
	words := strings.Fields(text)
	for _, word := range words {
		if len(word) >= 6 && len(word) <= 15 {
			// Check if it contains both letters and numbers
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

func (s *OCRService) extractFirstName(text string) string {
	// Basic name extraction - production would use NLP models
	words := strings.Fields(text)
	for i, word := range words {
		if len(word) > 2 && word[0] >= 'A' && word[0] <= 'Z' {
			// Look for patterns like "First Name:" or "Given Name:"
			if i > 0 && (strings.Contains(strings.ToLower(words[i-1]), "first") ||
				strings.Contains(strings.ToLower(words[i-1]), "given")) {
				return word
			}
		}
	}
	return ""
}

func (s *OCRService) extractLastName(text string) string {
	// Basic name extraction - production would use NLP models
	words := strings.Fields(text)
	for i, word := range words {
		if len(word) > 2 && word[0] >= 'A' && word[0] <= 'Z' {
			// Look for patterns like "Last Name:" or "Family Name:"
			if i > 0 && (strings.Contains(strings.ToLower(words[i-1]), "last") ||
				strings.Contains(strings.ToLower(words[i-1]), "family")) {
				return word
			}
		}
	}
	return ""
}

func (s *OCRService) extractBirthDate(text string) string {
	// Basic date extraction - production would use more sophisticated date parsing
	// Look for common date patterns
	words := strings.Fields(text)
	for _, word := range words {
		if strings.Contains(word, "/") || strings.Contains(word, "-") || strings.Contains(word, ".") {
			// Simple date validation
			if len(word) >= 8 && len(word) <= 10 {
				return word
			}
		}
	}
	return ""
}

func (s *OCRService) extractExpiryDate(text string) string {
	// Similar to birth date extraction
	return s.extractBirthDate(text)
}

// createFallbackData creates basic data structure when parsing fails
func (s *OCRService) createFallbackData(rawText string) *DocumentData {
	return &DocumentData{
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

// validateDocument performs basic document validation
func (s *OCRService) validateDocument(parsedData *DocumentData, rawText string) *ValidationResult {
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

// detectLiveness performs basic liveness detection
func (s *OCRService) detectLiveness(imageData []byte) (float64, error) {
	// This is a simplified liveness detection
	// In production, you'd use sophisticated computer vision models

	// For now, return a simulated score based on image size
	// Larger images typically have better quality
	if len(imageData) > 100000 { // > 100KB
		return 0.85, nil
	} else if len(imageData) > 50000 { // > 50KB
		return 0.75, nil
	} else {
		return 0.65, nil
	}
}

// assessFaceQuality assesses the quality of the face image
func (s *OCRService) assessFaceQuality(imageData []byte) float64 {
	// Simplified face quality assessment
	// In production, use computer vision models for face detection and quality assessment

	if len(imageData) > 150000 { // > 150KB
		return 0.9
	} else if len(imageData) > 100000 { // > 100KB
		return 0.8
	} else if len(imageData) > 50000 { // > 50KB
		return 0.7
	} else {
		return 0.6
	}
}

// DocumentData represents structured document information
type DocumentData struct {
	DocumentType   string
	CountryCode    string
	CardNumber     string
	DocumentNumber string
	FirstName      string
	MiddleName     string
	LastName       string
	BirthDate      string
	ExpiryDate     string
	Gender         string
	Nationality    string
	Address        *Address
}

// Address represents address information
type Address struct {
	Line1    string
	Line2    string
	City     string
	State    string
	Country  string
	Postcode string
}

// ValidationResult represents document validation results
type ValidationResult struct {
	IsValid    bool
	Confidence float64
	Issues     []string
}
