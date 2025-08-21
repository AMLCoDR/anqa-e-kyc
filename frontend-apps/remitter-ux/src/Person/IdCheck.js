import React, { useEffect } from 'react';

import { JourneyContainer } from 'idscan';

export const IdCehck = () => {
    
    let idScanDisplayContainer = React.createRef();

    useEffect(() => {
        // TODO: Fetch API token from our service..

       let journeyContainer = new JourneyContainer({
            auth: false,
            backendUrl: 'https://sydney.idscan.cloud:443',
            container: idScanDisplayContainer,
            journeyDefinitionId: '887fa09f-e942-4d11-b937-84e8e4263415',
            token: 'ehFqguRptThoouOxkufGJX0PkSZN8Oxf1e_cgSAK2rCtEjWn_jF19H3QxoeFH5Q-pWKgd-ysOn45tmcO8gVmINpMZ1q3Vr-P4DCQUh768wQkjKKt2-NHp3Bp_r_PcEFHIK0qPz2islYVvRivQ2z_51iJb8ajxfffrQLY3MQtUYDaFXdsynNHtW2q7KC-wJ1U7Zczjcz58SL3qzk14643kjtSBW4qr2WKT2u86BCoiAsLC8v03M6siaVMR3G5pL1sBbKXNainJx17AcLwbB7llZ5AqFDawcFRLWRg566w8h3yZ6TA0DefQ7_Y6OneMtnBxzQQxBJQfg-mdP8RsLB4dZhKJnVi42wWGuWwPksANbEOg5QffomtAu6KGse91p-6yW6L5m21oFfJEQvViI3NWzW-RVa6KdJj3zkjTkghbJbDYnK-RkuXQLDp9h3QqPh5963LtVCJDgxglCOzRdA8j8B8IudveAQQOSOjkpDUkMuyUeQGr9e14RwDA3Fz9QeIPHdb78qvRTRMWprJeDmSgWbVPNT_7Fa5U-vzolvZZhUzkkyxwv-InVMLQ1HlIWE-'
        });
    
        journeyContainer.initialize();

        return () => {
            journeyContainer.terminate();
        }
    });

    
    return (
        <div className="id-scan-content" ref={ref => idScanDisplayContainer= ref}>
            Loading...
        </div>
    );
}

export default IdCehck;
