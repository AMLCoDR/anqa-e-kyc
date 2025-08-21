import React, { useEffect, useState } from 'react';

import Stack from '@material-ui/core/Stack';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import config from '../config';
import { useData } from '../Datasource';
import { AuthService } from '../Services/AuthService';

export const Home = () => {    
    const [state] = useData();  
    const [fired, setFired] = useState(false);
    const [givenName, setGivenName] = useState(state.people[0].givenNames);
    const [familyName, setFamilyName] = useState(state.people[0].familyName);
    const [passportNumber, setPassportNumber] = useState(state.id.number);
    const [passportExpiry, setPassportExpiry] = useState(state.id.expiryDate);

    useEffect(() => {       
        if (!fired) {
            const authService = new AuthService();  
            authService.getUser().then(user => {
                setFired(true);  
                if (user) {            
                    let identityDid = config.mattrIdentityDid;        
                    if(identityDid && user.profile.sub === identityDid){                         
                        setGivenName(user.profile.givenName);      
                        setFamilyName(user.profile.familyName);    
                        setPassportNumber(user.profile.passportNumber);    
                        setPassportExpiry(user.profile.passportExpiry);       
                        return;                                      
                    }       
                } 
            });   
        }
    },[givenName, familyName, passportNumber, passportExpiry, fired]); 
  
    return (
        <>
            <Stack spacing={1} direction="row">
                <Typography variant="h6" gutterBottom>Success</Typography>
                <CheckCircleIcon color="success" />
            </Stack>
            <Typography sx={{ my: 2 }}>
                {givenName} {familyName}
            </Typography>
            <Stack sx={{ mb: 1 }}>
                <Typography gutterBottom>
                    NZ Passport
                </Typography>
                <Typography variant="body2">
                    Passport number: {passportNumber}
                </Typography>
                <Typography variant="body2">
                    Expiry date: {passportExpiry}
                </Typography>
            </Stack>
        </>
    );

}

export default Home;