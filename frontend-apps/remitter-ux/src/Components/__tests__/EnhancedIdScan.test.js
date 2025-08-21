import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnhancedIdScan } from '../EnhancedIdScan';

// Mock the camera component
jest.mock('../../Camera/ImagePreview', () => {
    return function MockImagePreview({ dataUri }) {
        return <div data-testid="image-preview">{dataUri ? 'Image Preview' : 'No Image'}</div>;
    };
});

// Mock the camera library
jest.mock('react-html5-camera-photo', () => {
    return {
        __esModule: true,
        default: function MockCamera(props) {
            return (
                <div data-testid="camera">
                    <button onClick={() => props.onTakePhotoAnimationDone('data:image/jpeg;base64,test')}>
                        Take Photo
                    </button>
                </div>
            );
        },
        IMAGE_TYPES: { JPG: 'jpg' }
    };
});

describe('EnhancedIdScan', () => {
    const defaultProps = {
        onDocument: jest.fn(),
        placeholderImg: '/test-image.png',
        placeholderCssClass: 'test-class',
        currentDocument: null,
        documentType: 'Test Document'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders capture mode selection by default', () => {
        render(<EnhancedIdScan {...defaultProps} />);
        
        expect(screen.getByText('Test Document Capture')).toBeInTheDocument();
        expect(screen.getByText('📸 Take Photo')).toBeInTheDocument();
        expect(screen.getByText('📁 Upload File')).toBeInTheDocument();
    });

    test('shows camera interface when camera mode is selected', () => {
        render(<EnhancedIdScan {...defaultProps} />);
        
        fireEvent.click(screen.getByText('📸 Take Photo'));
        
        expect(screen.getByText('📸 Camera Capture')).toBeInTheDocument();
        expect(screen.getByTestId('camera')).toBeInTheDocument();
    });

    test('shows file upload interface when upload mode is selected', () => {
        render(<EnhancedIdScan {...defaultProps} />);
        
        fireEvent.click(screen.getByText('📁 Upload File'));
        
        expect(screen.getByText('📁 File Upload')).toBeInTheDocument();
        expect(screen.getByText('Click to Upload Test Document')).toBeInTheDocument();
    });

    test('shows document preview when currentDocument is provided', () => {
        render(<EnhancedIdScan {...defaultProps} currentDocument="data:image/jpeg;base64,test" />);
        
        expect(screen.getByText('Test Document Captured')).toBeInTheDocument();
        expect(screen.getByTestId('image-preview')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    test('calls onDocument when photo is taken', async () => {
        render(<EnhancedIdScan {...defaultProps} />);
        
        fireEvent.click(screen.getByText('📸 Take Photo'));
        fireEvent.click(screen.getByText('Take Photo'));
        
        await waitFor(() => {
            expect(defaultProps.onDocument).toHaveBeenCalledWith('data:image/jpeg;base64,test');
        });
    });

    test('handles file upload correctly', async () => {
        render(<EnhancedIdScan {...defaultProps} />);
        
        fireEvent.click(screen.getByText('📁 Upload File'));
        
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const input = screen.getByDisplayValue('');
        
        fireEvent.change(input, { target: { files: [file] } });
        
        await waitFor(() => {
            expect(defaultProps.onDocument).toHaveBeenCalled();
        });
    });

    test('validates file type correctly', () => {
        render(<EnhancedIdScan {...defaultProps} />);
        
        fireEvent.click(screen.getByText('📁 Upload File'));
        
        const file = new File(['test'], 'test.txt', { type: 'text/plain' });
        const input = screen.getByDisplayValue('');
        
        fireEvent.change(input, { target: { files: [file] } });
        
        expect(screen.getByText('Please select an image file (JPG, PNG) or PDF')).toBeInTheDocument();
    });

    test('validates file size correctly', () => {
        render(<EnhancedIdScan {...defaultProps} />);
        
        fireEvent.click(screen.getByText('📁 Upload File'));
        
        // Create a file larger than 10MB
        const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
        const input = screen.getByDisplayValue('');
        
        fireEvent.change(input, { target: { files: [largeFile] } });
        
        expect(screen.getByText('File size must be less than 10MB')).toBeInTheDocument();
    });

    test('resets state when retry is clicked', () => {
        render(<EnhancedIdScan {...defaultProps} currentDocument="data:image/jpeg;base64,test" />);
        
        fireEvent.click(screen.getByText('Try Again'));
        
        expect(screen.getByText('Test Document Capture')).toBeInTheDocument();
        expect(screen.getByText('📸 Take Photo')).toBeInTheDocument();
        expect(screen.getByText('📁 Upload File')).toBeInTheDocument();
    });
});
