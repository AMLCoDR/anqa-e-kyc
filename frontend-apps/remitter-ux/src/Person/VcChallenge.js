import React, { useEffect, useState } from 'react';

import config from '../config';
import { AuthService } from '../Services/AuthService';

export const VcChallenge = (props) => {
    const { onNext } = props;
    const [fired, setFired] = useState(false);

    useEffect(() => {       
        const authService = new AuthService();        
        authService.getUser().then(user => {
            if (user) {  
                let identityDid = config.mattrIdentityDid;        
                if(identityDid && user.profile.sub === identityDid){     
                    if (!fired) {
                        setFired(true);
                        onNext();
                    }
                }  else {                   
                   authService.login();
                }         
            }
            else {               
              authService.login();          
            }            
        });        
    }, [fired, onNext]);

    return (
        <>             
        </>
    );
}

export default VcChallenge;
