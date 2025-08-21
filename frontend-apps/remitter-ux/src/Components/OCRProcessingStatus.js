import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    LinearProgress,
    Stack,
    Chip,
    Alert,
    CircularProgress
} from '@material-ui/core';
import {
    CheckCircle as CheckIcon,
    Error as ErrorIcon,
    Schedule as ScheduleIcon,
    DocumentScanner as ScannerIcon,
    TextFields as TextIcon,
    VerifiedUser as VerifiedIcon
} from '@material-ui/icons';

export const OCRProcessingStatus = ({ 
    isProcessing, 
    stage, 
    progress, 
    error, 
    success, 
    documentType = 'Document',
    onRetry 
}) => {
    const [currentStage, setCurrentStage] = useState(stage);
    const [currentProgress, setCurrentProgress] = useState(progress || 0);

    useEffect(() => {
        setCurrentStage(stage);
        setCurrentProgress(progress || 0);
    }, [stage, progress]);

    const getStageIcon = (stageName) => {
        switch (stageName) {
            case 'uploading':
                return <ScheduleIcon />;
            case 'processing':
                return <ScannerIcon />;
            case 'extracting':
                return <TextIcon />;
            case 'validating':
                return <VerifiedIcon />;
            case 'complete':
                return <CheckIcon />;
            default:
                return <ScheduleIcon />;
        }
    };

    const getStageColor = (stageName) => {
        switch (stageName) {
            case 'uploading':
                return 'primary';
            case 'processing':
                return 'info';
            case 'extracting':
                return 'warning';
            case 'validating':
                return 'secondary';
            case 'complete':
                return 'success';
            default:
                return 'default';
        }
    };

    const getStageDescription = (stageName) => {
        switch (stageName) {
            case 'uploading':
                return 'Uploading document to OCR service...';
            case 'processing':
                return 'Processing image with AI-powered OCR...';
            case 'extracting':
                return 'Extracting text and data fields...';
            case 'validating':
                return 'Validating document authenticity...';
            case 'complete':
                return 'Document processing completed successfully!';
            default:
                return 'Preparing to process document...';
        }
    };

    if (success) {
        return (
            <Card variant="outlined" sx={{ mb: 2, borderColor: 'success.main' }}>
                <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" color="success.main">
                            ✅ {documentType} Processed Successfully
                        </Typography>
                        <Chip 
                            icon={<CheckIcon />} 
                            label="Complete" 
                            color="success" 
                            size="small" 
                        />
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Your {documentType.toLowerCase()} has been successfully processed and verified.
                    </Typography>

                    <Stack direction="row" spacing={1}>
                        <Chip 
                            label="Text Extracted" 
                            size="small" 
                            variant="outlined" 
                            color="success"
                        />
                        <Chip 
                            label="Fields Parsed" 
                            size="small" 
                            variant="outlined" 
                            color="success"
                        />
                        <Chip 
                            label="Authenticated" 
                            size="small" 
                            variant="outlined" 
                            color="success"
                        />
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card variant="outlined" sx={{ mb: 2, borderColor: 'error.main' }}>
                <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" color="error.main">
                            ❌ Processing Failed
                        </Typography>
                        <Chip 
                            icon={<ErrorIcon />} 
                            label="Error" 
                            color="error" 
                            size="small" 
                        />
                    </Box>
                    
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>

                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        There was an issue processing your {documentType.toLowerCase()}. Please try again.
                    </Typography>

                    <Box display="flex" justifyContent="flex-end">
                        <Chip 
                            label="Retry Processing" 
                            onClick={onRetry}
                            color="primary"
                            variant="outlined"
                            clickable
                        />
                    </Box>
                </CardContent>
            </Card>
        );
    }

    if (!isProcessing) {
        return null;
    }

    return (
        <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" color="primary">
                        🔍 Processing {documentType}
                    </Typography>
                    <Chip 
                        icon={getStageIcon(currentStage)} 
                        label={currentStage || 'Processing'} 
                        color={getStageColor(currentStage)} 
                        size="small" 
                    />
                </Box>

                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    {getStageDescription(currentStage)}
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <LinearProgress 
                        variant="determinate" 
                        value={currentProgress} 
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        {currentProgress}% Complete
                    </Typography>
                </Box>

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Box display="flex" alignItems="center">
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                        <Typography variant="caption" color="textSecondary">
                            AI Processing
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                        <Typography variant="caption" color="textSecondary">
                            Text Extraction
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                        <Typography variant="caption" color="textSecondary">
                            Validation
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default OCRProcessingStatus;
