import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    Chip,
    Stack,
    Button
} from '@material-ui/core';
import {
    CheckCircle as CheckIcon,
    Schedule as PendingIcon,
    Error as ErrorIcon,
    Refresh as RetryIcon
} from '@material-ui/icons';
import ImagePreview from '../Camera/ImagePreview';

export const DocumentPreviewGrid = ({ 
    idDocument, 
    addressDocument, 
    idStatus = 'pending', 
    addressStatus = 'pending',
    onIdRetry,
    onAddressRetry,
    onIdEdit,
    onAddressEdit
}) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending':
                return {
                    color: 'default',
                    icon: <PendingIcon />,
                    label: 'Pending',
                    description: 'Document not yet captured'
                };
            case 'processing':
                return {
                    color: 'info',
                    icon: <PendingIcon />,
                    label: 'Processing',
                    description: 'OCR processing in progress'
                };
            case 'success':
                return {
                    color: 'success',
                    icon: <CheckIcon />,
                    label: 'Verified',
                    description: 'Document verified successfully'
                };
            case 'error':
                return {
                    color: 'error',
                    icon: <ErrorIcon />,
                    label: 'Failed',
                    description: 'Verification failed'
                };
            default:
                return {
                    color: 'default',
                    icon: <PendingIcon />,
                    label: 'Unknown',
                    description: 'Status unknown'
                };
        }
    };

    const renderDocumentCard = (document, status, documentType, onRetry, onEdit) => {
        const statusConfig = getStatusConfig(status);
        const hasDocument = document && status !== 'pending';

        return (
            <Card 
                variant="outlined" 
                sx={{ 
                    height: '100%',
                    borderColor: status === 'success' ? 'success.main' : 
                                status === 'error' ? 'error.main' : 'divider'
                }}
            >
                <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" color="primary">
                            {documentType}
                        </Typography>
                        <Chip 
                            icon={statusConfig.icon}
                            label={statusConfig.label}
                            color={statusConfig.color}
                            size="small"
                        />
                    </Box>

                    {hasDocument ? (
                        <>
                            <Box sx={{ mb: 2 }}>
                                <ImagePreview dataUri={document} isFullscreen={false} />
                            </Box>
                            
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                {statusConfig.description}
                            </Typography>

                            <Stack direction="row" spacing={1}>
                                {status === 'success' && (
                                    <Chip 
                                        label="Text Extracted" 
                                        size="small" 
                                        variant="outlined" 
                                        color="success"
                                    />
                                )}
                                {status === 'success' && (
                                    <Chip 
                                        label="Fields Parsed" 
                                        size="small" 
                                        variant="outlined" 
                                        color="success"
                                    />
                                )}
                                {status === 'error' && (
                                    <Chip 
                                        label="Verification Failed" 
                                        size="small" 
                                        variant="outlined" 
                                        color="error"
                                    />
                                )}
                            </Stack>
                        </>
                    ) : (
                        <Box 
                            display="flex" 
                            flexDirection="column" 
                            alignItems="center" 
                            justifyContent="center" 
                            py={4}
                            sx={{ 
                                border: '2px dashed',
                                borderColor: 'divider',
                                borderRadius: 2,
                                backgroundColor: 'action.hover'
                            }}
                        >
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                {statusConfig.description}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                Click to capture or upload
                            </Typography>
                        </Box>
                    )}

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        {status === 'error' && onRetry && (
                            <Button 
                                size="small" 
                                variant="outlined" 
                                color="primary"
                                onClick={onRetry}
                                startIcon={<RetryIcon />}
                            >
                                Retry
                            </Button>
                        )}
                        {hasDocument && onEdit && (
                            <Button 
                                size="small" 
                                variant="outlined" 
                                color="secondary"
                                onClick={onEdit}
                            >
                                Edit
                            </Button>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        );
    };

    return (
        <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    📸 Document Status Overview
                </Typography>
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        {renderDocumentCard(
                            idDocument,
                            idStatus,
                            'Government ID',
                            onIdRetry,
                            onIdEdit
                        )}
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        {renderDocumentCard(
                            addressDocument,
                            addressStatus,
                            'Address Proof',
                            onAddressRetry,
                            onAddressEdit
                        )}
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3, p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                        <strong>Next Steps:</strong> Both documents must be successfully verified before proceeding. 
                        You can retry failed verifications or edit successfully processed documents.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default DocumentPreviewGrid;
