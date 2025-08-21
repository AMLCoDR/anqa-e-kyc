import React, { useState } from 'react';

import Alert from '@material-ui/core/Alert';
import Button from '@material-ui/core/Button';
import Stack from '@material-ui/core/Stack';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import { LoadingButton } from '@material-ui/lab';
import { v4 as uuidv4 } from 'uuid';

import EnhancedIdScan from '../Camera/EnhancedIdScan';
import { AnqaOCRService } from '../Services/AnqaOCRService';
import AddressSearch from './AddressSearch';
import Complete from './Complete';
import ReviewDetails from './ReviewDetails';
import OCRProcessingStatus from '../Components/OCRProcessingStatus';
import DocumentPreviewGrid from '../Components/DocumentPreviewGrid';
import ToastNotifications from '../Components/ToastNotifications';

export const SelfOnboarder = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [idDocument, setIdDocument] = useState();
    const [idDocumentIssue, setIdDocumentIssue] = useState();
    const [isIdentified, setIsIdentified] = useState(false);
    const [idSelfie, setIdSelfie] = useState();
    const [idSelfieIssue, setIdSelfieIssue] = useState();
    const [isIdSelfieMatched, setIsIdSelfieMatched] = useState(false);
    const [loading, setLoading] = useState();
    const [addressTouched, setAddressTouched] = useState(false);
    const [addressDocument, setAddressDocument] = useState(null);
    const [idProcessingStage, setIdProcessingStage] = useState('');
    const [idProcessingProgress, setIdProcessingProgress] = useState(0);
    const [addressProcessingStage, setAddressProcessingStage] = useState('');
    const [addressProcessingProgress, setAddressProcessingProgress] = useState(0);

    const [model, setModel] = useState({
        entryId: uuidv4(),
        person: {},
        address: {
            address1: '',
            address2: '',
            city: '',
            state: '',
            postcode: '',
            country: ''
        },
        identification: {},
        idVerification: {},
        errorMessages: {}
    });

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleNext = () => {
        setActiveStep(prev => prev + 1);
    };

    const setDocument = (dataUri) => {
        setIdDocument(dataUri);
    };

    const handleAddressDocument = (dataUri) => {
        setAddressDocument(dataUri);
    };

    const setSelfie = (dataUri) => {
        setIdSelfie(dataUri);
    };

    const processIdDocument = async () => {
        if (!idDocument) {
            setIdDocumentIssue('Please take a photo of your document by clicking the white circle.');
            return false;
        }
        
        setLoading(true);
        setIdProcessingStage('uploading');
        setIdProcessingProgress(20);
        
        try {
            // Simulate progress stages
            setTimeout(() => {
                setIdProcessingStage('processing');
                setIdProcessingProgress(40);
            }, 1000);
            
            setTimeout(() => {
                setIdProcessingStage('extracting');
                setIdProcessingProgress(60);
            }, 2000);
            
            setTimeout(() => {
                setIdProcessingStage('validating');
                setIdProcessingProgress(80);
            }, 3000);
            
            const sc = new AnqaOCRService();
            const result = await sc.processIdDocument({ entryId: model.entryId, image: idDocument });
            
            setIdProcessingProgress(100);
            setIdProcessingStage('complete');
            
            setLoading(false);
            let entryData = result.data.EntryData;
            console.log('Anqa OCR Results', result);
            
            if (result.data.CurrentResult === "Pass" && entryData.OverallAuthenticationState === "Passed") {
                setModel(model => ({
                    ...model, idVerification: entryData
                }));
                setModel(model => ({
                    ...model, identification: {
                        documentType: entryData['DocumentType'],
                        countryCode: entryData['CountryCode'],
                        cardNumber: entryData['ExtractedFields.CardNumber'],
                        documentNumber: entryData['ExtractedFields.DocumentNumber'],
                        expiryDate: null
                    }
                }));
                setModel(model => ({
                    ...model, person: {
                        givenNames: entryData['ExtractedFields.FirstName'],
                        middleNames: entryData['ExtractedFields.MiddleName'],
                        familyName: entryData['ExtractedFields.LastName'],
                        birthDate: entryData['ExtractedFields.BirthDate']
                    }
                }));
                setIsIdentified(true);
                
                // Show success toast
                if (window.showToast) {
                    window.showToast('ID document verified successfully!', 'success');
                }
                
                handleNext();
                return true;
            }
            setIdDocumentIssue('We have not been able to scan your identification, please try again or enter your details manually.');
            
            // Show error toast
            if (window.showToast) {
                window.showToast('ID document verification failed. Please try again.', 'error');
            }
            
            return false;
        }
        catch (error) {
            setIdDocumentIssue('There has been an unexpected issue contacting the Anqa OCR service');
            console.log('Anqa OCR Service error: ', error);
            setLoading(false);
            
            // Show error toast
            if (window.showToast) {
                window.showToast('OCR service error. Please try again.', 'error');
            }
            
            return false
        }
    };

    const processIdSelfie = async () => {
        if (!idSelfie) {
            setIdSelfieIssue('Please take a selfie by clicking the white circle.');
            return false;
        }
        setLoading(true);
        try {
            const sc = new AnqaOCRService();
            const result = await sc.processSelfie({ entryId: model.entryId, image: idSelfie });
            setLoading(false);
            let entryData = result.data.EntryData;        
            if (result.data.CurrentResult === "Pass" && entryData.AutomatedFaceMatchResult === "PASSED") {
                setModel(model => ({
                    ...model, idVerification: entryData
                }));
                setIsIdSelfieMatched(true);
                
                // Show success toast
                if (window.showToast) {
                    window.showToast('Selfie verification completed successfully!', 'success');
                }
                
                handleNext();
                return true;
            }
            setIdSelfieIssue('We have not been able to confirm you are the person pictured on your ID, please try again.');
            
            // Show error toast
            if (window.showToast) {
                window.showToast('Selfie verification failed. Please try again.', 'error');
            }
            
            return false;
        }
        catch (error) {
            console.log("Error: ", error);
            setLoading(false);
            
            // Show error toast
            if (window.showToast) {
                window.showToast('Selfie processing error. Please try again.', 'error');
            }
            
            return false
        }
    };

    const handlePersonUpdate = (event) => {
        const { name, value } = event.target;
        if (name) {
            setModel(model => ({
                ...model, person: {
                    ...model.person,
                    [name]: value
                }
            }));
        }
    }

    const handleIdentificationUpdate = (event) => {
        const { name, value } = event.target;
        if (name) {
            setModel(model => ({
                ...model, identification: {
                    ...model.identification,
                    [name]: value
                }
            }));
        }
    }

    const handleIdDocumentRetry = () => {
        setIdDocument();
        setIsIdentified(false);
        setIdDocumentIssue(null);
    };

    const handleSelfieRetry = () => {
        setIdSelfie();
        setIsIdSelfieMatched(false);
        setIdSelfieIssue(null);
    };

    const handleReviewDetails = () => {
        let hasError = false;
        if (!model.person.givenNames) { hasError = true };
        if (!model.person.familyName) { hasError = true };
        if (!model.person.birthDate) { hasError = true };
        if (!model.identification.documentType) { hasError = true };
        if (!model.identification.documentNumber) { hasError = true };
        //if (!model.identification.expiryDate) { hasError = true };
        if (!hasError) {
            handleNext();
            return true;
        }
        return false;
    };

    const handleAddressSearchUpdate = (address) => {            
        setModel(model => ({
            ...model, address: address
        }));
    }

    const handleAddressUpdate = (event) => {
        const { name, value } = event.target;
        if (name) {
            setModel(model => ({
                ...model, address: {
                    ...model.address,
                    [name]: value
                }
            }));
        }
    }

    const handleAddressDetails = () => {
        setAddressTouched(true);
        let hasError = false;
        if (!model.address.address1) { hasError = true };
        if (!model.address.city) { hasError = true };
        if (!model.address.state) { hasError = true };
        if (!model.address.postcode) { hasError = true };
        if (!model.address.country) { hasError = true };        
        if (!hasError) {
            handleNext();
            return true;
        }      
        return false;
    };

    return (
        <>
            <ToastNotifications />
            
            <Typography variant="h2">Verify Identity</Typography>
            <Typography variant="subtitle" gutterBottom>
                The information you provide will help us to quickly confirm your identity.
            </Typography>

            {/* Document Status Overview */}
            <DocumentPreviewGrid
                idDocument={idDocument}
                addressDocument={addressDocument}
                idStatus={isIdentified ? 'success' : idDocument ? 'pending' : 'pending'}
                addressStatus={addressDocument ? 'pending' : 'pending'}
                onIdRetry={handleIdDocumentRetry}
                onAddressRetry={() => setAddressDocument(null)}
                onIdEdit={() => setIsIdentified(false)}
                onAddressEdit={() => setAddressDocument(null)}
            />

            <Stepper orientation="vertical" activeStep={activeStep}>
                <Step key="Scan ID">
                    <StepLabel optional={<Typography variant="caption">We can get the information we require directly off your chosen ID</Typography>}>
                        Scan ID
                    </StepLabel>
                    <StepContent>
                        {idDocumentIssue ? <Alert variant="outlined" severity="warning" sx={{ mt: 1, mb: 4 }}>{idDocumentIssue}</Alert> : <></>}
                        
                        <EnhancedIdScan 
                            onDocument={setDocument} 
                            placeholderImg={"/images/id-card.png"} 
                            placeholderCssClass="id-overlay" 
                            currentDocument={idDocument}
                            documentType="Government ID"
                        />
                        
                        {/* OCR Processing Status */}
                        {loading && (
                            <OCRProcessingStatus
                                isProcessing={loading}
                                stage={idProcessingStage}
                                progress={idProcessingProgress}
                                documentType="Government ID"
                                onRetry={handleIdDocumentRetry}
                            />
                        )}
                        
                        <Stack spacing={1} direction="row" sx={{ mt: 1 }}>
                            <LoadingButton 
                                loading={loading} 
                                onClick={processIdDocument} 
                                disabled={!idDocument || isIdentified} 
                                loadingPosition="start" 
                                startIcon={<SendIcon />} 
                                variant="outlined" 
                                size="large"
                            >
                                I'm happy with this picture
                            </LoadingButton>
                            {idDocument ?
                                <Button variant="outlined" onClick={handleIdDocumentRetry} disabled={loading} >
                                    Try again
                                </Button> : <></>}
                            {isIdentified ?
                                <Button variant="outlined" onClick={handleNext}>
                                    Keep this one
                                </Button> : <></>}
                        </Stack>
                    </StepContent>
                </Step>

                <Step key="Address Documents">
                    <StepLabel optional={<Typography variant="caption">Please provide proof of your address</Typography>}>
                        Address Documents
                    </StepLabel>
                    <StepContent>
                        <EnhancedIdScan 
                            onDocument={handleAddressDocument} 
                            placeholderImg={"/images/address-proof.png"} 
                            placeholderCssClass="address-overlay" 
                            currentDocument={addressDocument}
                            documentType="Address Proof"
                        />
                        
                        <Stack spacing={1} direction="row" sx={{ mt: 1 }}>
                            <Button 
                                variant="outlined" 
                                onClick={() => setAddressDocument(null)} 
                                disabled={!addressDocument}
                            >
                                Try again
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={handleNext}
                                disabled={!addressDocument}
                            >
                                Continue
                            </Button>
                        </Stack>
                    </StepContent>
                </Step>

                <Step key="Review Details">
                    <StepLabel optional={<Typography variant="caption">Check the details we scanned are correct before proceeding</Typography>}>
                        Review Details
                    </StepLabel>
                    <StepContent>
                        <ReviewDetails model={model} handlePersonChange={handlePersonUpdate} handleIdentificationChange={handleIdentificationUpdate} />
                        <Stack spacing={1} direction="row">
                            <Button onClick={handleReviewDetails} variant="contained" sx={{ mt: 1, mr: 1 }}>
                                Confirm your details
                            </Button>
                            <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                                Back
                            </Button>
                        </Stack>
                    </StepContent>
                </Step>

                <Step key="Address Details">
                    <StepLabel optional={<Typography variant="caption">Please search for, or enter your registered address details</Typography>}>
                        Address Details
                    </StepLabel>
                    <StepContent>
                        <AddressSearch  address={model.address} handleAddressChange={handleAddressUpdate} handleAddressSearchSelect={handleAddressSearchUpdate} touched={addressTouched} sx={{ mt: 1, mr: 1 }} />
                        <Stack spacing={1} direction="row" sx={{ mt: 1 }}>
                            <Button onClick={handleAddressDetails} variant="contained" sx={{ mt: 1, mr: 1 }}>
                                Confirm your address
                            </Button>
                            <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                                Back
                            </Button>
                        </Stack>
                    </StepContent>
                </Step>

                <Step key="Selfie">
                    <StepLabel optional={<Typography variant="caption">In order to confirm you own the document we'd like you to upload a selfie</Typography>}>
                        Selfie
                    </StepLabel>
                    <StepContent>
                        {idSelfieIssue ? <Alert variant="outlined" severity="warning" sx={{ mt: 1, mb: 4 }}>{idSelfieIssue}</Alert> : <></>}
                        <IdScan onDocument={setSelfie} placeholderImg={"/images/id-selfie.png"} placeholderCssClass="selfie-overlay" currentDocument={idSelfie} />
                        <Stack spacing={1} direction="row" sx={{ mt: 1 }}>
                            <LoadingButton loading={loading} onClick={processIdSelfie} disabled={!idSelfie || isIdSelfieMatched} loadingPosition="start" startIcon={<SendIcon />} variant="outlined" size="large">
                                I'm happy with this picture
                            </LoadingButton>
                            {idSelfie ?
                                <Button variant="outlined" onClick={handleSelfieRetry} disabled={loading} >
                                    Try again
                                </Button> : <></>}
                            {isIdSelfieMatched ?
                                <Button variant="outlined" onClick={handleNext}>
                                    Keep this one
                                </Button> : <></>}
                            <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                                Back
                            </Button>
                        </Stack>
                    </StepContent>
                </Step>

                <Step key="Compelete">
                    <StepLabel>
                        Compelete
                    </StepLabel>
                    <StepContent>
                        <Complete />
                    </StepContent>
                </Step>

            </Stepper>
        </>
    );
}

export default SelfOnboarder