import React, { useState, useRef } from 'react';
import { 
    Button, 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    Stack,
    Alert,
    CircularProgress,
    Chip
} from '@material-ui/core';
import { 
    CameraAlt as CameraIcon, 
    Upload as UploadIcon,
    CheckCircle as CheckIcon,
    Error as ErrorIcon,
    Refresh as RefreshIcon
} from '@material-ui/icons';
import Camera, { IMAGE_TYPES } from 'react-html5-camera-photo';
import './css/camera.css';
import ImagePreview from './ImagePreview';

export const EnhancedIdScan = ({ 
    onDocument, 
    placeholderImg, 
    placeholderCssClass, 
    currentDocument,
    documentType = 'ID Document',
    onProcessingStart,
    onProcessingComplete,
    onProcessingError
}) => {
    const [captureMode, setCaptureMode] = useState(null); // 'camera' or 'upload'
    const [cameraStarted, setCameraStarted] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [processingStage, setProcessingStage] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const fileInputRef = useRef(null);
    const cameraRef = useRef(null);

    const handleCameraStart = () => {
        setCameraStarted(true);
        setError(null);
    };

    const handleTakePhotoAnimationDone = (dataUri) => {
        setProcessing(true);
        setProcessingStage('Processing captured image...');
        
        // Simulate processing delay for better UX
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
            setProcessingStage('');
            onDocument(dataUri);
            
            // Auto-reset success state after 2 seconds
            setTimeout(() => setSuccess(false), 2000);
        }, 1500);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            setError('Please select an image file (JPG, PNG) or PDF');
            return;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            setError('File size must be less than 10MB');
            return;
        }

        setError(null);
        setProcessing(true);
        setProcessingStage('Processing uploaded file...');

        // Convert file to data URI
        const reader = new FileReader();
        reader.onload = (e) => {
            setTimeout(() => {
                setProcessing(false);
                setSuccess(true);
                setProcessingStage('');
                onDocument(e.target.result);
                
                // Auto-reset success state after 2 seconds
                setTimeout(() => setSuccess(false), 2000);
            }, 1000);
        };
        reader.readAsDataURL(file);
    };

    const handleRetry = () => {
        setCaptureMode(null);
        setCameraStarted(false);
        setProcessing(false);
        setProcessingStage('');
        setError(null);
        setSuccess(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const openCamera = () => {
        setCaptureMode('camera');
        setError(null);
    };

    const openFileUpload = () => {
        setCaptureMode('upload');
        setError(null);
        fileInputRef.current?.click();
    };

    const closeCamera = () => {
        setCaptureMode(null);
        setCameraStarted(false);
    };

    // If we have a current document, show preview
    if (currentDocument) {
        return (
            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" color="primary">
                            {documentType} Captured
                        </Typography>
                        {success && (
                            <Chip 
                                icon={<CheckIcon />} 
                                label="Success" 
                                color="success" 
                                size="small" 
                            />
                        )}
                    </Box>
                    
                    <ImagePreview dataUri={currentDocument} isFullscreen={false} />
                    
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button 
                            variant="outlined" 
                            onClick={handleRetry}
                            startIcon={<RefreshIcon />}
                        >
                            Try Again
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    // Show capture mode selection
    if (!captureMode) {
        return (
            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {documentType} Capture
                    </Typography>
                    
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Choose how you'd like to provide your {documentType.toLowerCase()}
                    </Typography>

                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<CameraIcon />}
                            onClick={openCamera}
                            sx={{ flex: 1, py: 2 }}
                        >
                            📸 Take Photo
                        </Button>
                        
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<UploadIcon />}
                            onClick={openFileUpload}
                            sx={{ flex: 1, py: 2 }}
                        >
                            📁 Upload File
                        </Button>
                    </Stack>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </CardContent>
            </Card>
        );
    }

    // Show camera interface
    if (captureMode === 'camera') {
        return (
            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" color="primary">
                            📸 Camera Capture
                        </Typography>
                        <Button 
                            size="small" 
                            onClick={closeCamera}
                            variant="outlined"
                        >
                            Close Camera
                        </Button>
                    </Box>

                    {processing ? (
                        <Box display="flex" flexDirection="column" alignItems="center" py={4}>
                            <CircularProgress size={60} sx={{ mb: 2 }} />
                            <Typography variant="body1" color="primary">
                                {processingStage}
                            </Typography>
                        </Box>
                    ) : (
                        <Box position="relative">
                            <PlaceholderImage />
                            <Camera
                                ref={cameraRef}
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    position: 'absolute', 
                                    top: 0, 
                                    left: 0 
                                }}
                                onTakePhotoAnimationDone={handleTakePhotoAnimationDone}
                                isFullscreen={false}
                                imageType={IMAGE_TYPES.JPG}
                                onCameraStart={handleCameraStart}
                                isMaxResolution={true}
                                isImageMirror={false}
                                imageCompression="1"
                            />
                        </Box>
                    )}

                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
                        Position your {documentType.toLowerCase()} clearly in the frame and click the capture button
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    // Show file upload interface
    if (captureMode === 'upload') {
        return (
            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" color="primary">
                            📁 File Upload
                        </Typography>
                        <Button 
                            size="small" 
                            onClick={() => setCaptureMode(null)}
                            variant="outlined"
                        >
                            Back to Options
                        </Button>
                    </Box>

                    {processing ? (
                        <Box display="flex" flexDirection="column" alignItems="center" py={4}>
                            <CircularProgress size={60} sx={{ mb: 2 }} />
                            <Typography variant="body1" color="primary">
                                {processingStage}
                            </Typography>
                        </Box>
                    ) : (
                        <Box 
                            border="2px dashed" 
                            borderColor="primary.main" 
                            borderRadius={2} 
                            p={4} 
                            textAlign="center"
                            sx={{ 
                                cursor: 'pointer',
                                '&:hover': { 
                                    borderColor: 'primary.dark',
                                    backgroundColor: 'action.hover'
                                }
                            }}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Click to Upload {documentType}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Supports: JPG, PNG, PDF (Max: 10MB)
                            </Typography>
                            
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                            />
                        </Box>
                    )}
                </CardContent>
            </Card>
        );
    }

    return null;
};

// Helper component for placeholder image
const PlaceholderImage = () => (
    <div style={{ 
        width: '100%', 
        height: '300px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8
    }}>
        <Typography variant="body2" color="textSecondary">
            Camera starting...
        </Typography>
    </div>
);

export default EnhancedIdScan;
