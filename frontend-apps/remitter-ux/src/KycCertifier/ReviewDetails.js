import React from 'react';

import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import DesktopDatePicker from '@material-ui/lab/DesktopDatePicker';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';

export const ReviewDetails = (props) => {

    return (
        <>
            <Box component="form" sx={{ mt: 1 }} noValidate autoComplete="off">
                <FormControl fullWidth margin="normal">
                    <TextField name="givenNames" label="Given names" variant="outlined"
                        value={props.model.person.givenNames}
                        onChange={event => props.handlePersonChange(event)}
                        error={props.model.person.givenNames === ""}
                        helperText={props.model.person.givenNames === "" ? 'Please provide your first name' : false}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField name="middleNames" label="Middle names" variant="outlined"
                        value={props.model.person.middleNames}
                        onChange={event => props.handlePersonChange(event)}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField name="familyName" label="Family name" variant="outlined"
                        value={props.model.person.familyName}
                        onChange={event => props.handlePersonChange(event)}
                        error={props.model.person.familyName === ""}
                        helperText={props.model.person.familyName === "" ? 'Please provide your family name' : false}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            name="birthDate"
                            label="Date of birth"
                            inputFormat="dd/MM/yyyy"
                            value={props.model.person.birthDate}                         
                            onChange={(value) => props.model.person.birthDate = value}                         
                            renderInput={(params) => <TextField {...params}
                                error={props.model.person.birthDate === ""}
                                helperText={props.model.person.birthDate === "" ? 'Please provide your birthdate' : false}
                            />}
                        />
                    </LocalizationProvider>
                </FormControl>

                <FormControl fullWidth margin="normal" error={props.model.identification.documentType === ""}>
                    <InputLabel id="verification-type-label">Verification method</InputLabel>
                    <Select
                        labelId="verification-type-label"
                        name="documentType"
                        label="Verification method"
                        value={props.model.identification.documentType}
                        onChange={event => props.handleIdentificationChange(event)}
                        error={props.model.identification.documentType === ""}
                    >
                        <MenuItem value={'Driving License'}>Driving License</MenuItem>
                        <MenuItem value={'National Passport'}>Passport</MenuItem>
                        <MenuItem value={'National Identification Card'}>National Identification Card</MenuItem>
                    </Select>
                    {props.model.identification.countryCode === "" ?
                        <FormHelperText>Please select your identification type</FormHelperText> : <></>}                   
                </FormControl>

                <FormControl fullWidth margin="normal" error={props.model.identification.countryCode === ""}>
                    <InputLabel id="issuing-country-label">Issuing Country</InputLabel>
                    <Select
                        labelId="issuing-country-label"
                        name="countryCode"
                        label="Issuing Country"
                        value={props.model.identification.countryCode}
                        onChange={event => props.handleIdentificationChange(event)}
                    >
                        <MenuItem value=''>Select issuing country</MenuItem>
                        <MenuItem value='AFG'>Afghanistan</MenuItem>
                        <MenuItem value='ALB'>Albania</MenuItem>
                        <MenuItem value='DZA'>Algeria</MenuItem>
                        <MenuItem value='AND'>Andorra</MenuItem>
                        <MenuItem value='AGO'>Angola</MenuItem>
                        <MenuItem value='ATG'>Antigua and Barbuda</MenuItem>
                        <MenuItem value='ARG'>Argentina</MenuItem>
                        <MenuItem value='ARM'>Armenia</MenuItem>
                        <MenuItem value='AUS'>Australia</MenuItem>
                        <MenuItem value='AUT'>Austria</MenuItem>
                        <MenuItem value='AZE'>Azerbaijan</MenuItem>
                        <MenuItem value='BHS'>Bahamas</MenuItem>
                        <MenuItem value='BHR'>Bahrain</MenuItem>
                        <MenuItem value='BGD'>Bangladesh</MenuItem>
                        <MenuItem value='BRB'>Barbados</MenuItem>
                        <MenuItem value='BLR'>Belarus</MenuItem>
                        <MenuItem value='BEL'>Belgium</MenuItem>
                        <MenuItem value='BLZ'>Belize</MenuItem>
                        <MenuItem value='BEN'>Benin</MenuItem>
                        <MenuItem value='BTN'>Bhutan</MenuItem>
                        <MenuItem value='BOL'>Bolivia, Plurinational State of</MenuItem>
                        <MenuItem value='BIH'>Bosnia and Herzegovina</MenuItem>
                        <MenuItem value='BWA'>Botswana</MenuItem>
                        <MenuItem value='BRA'>Brazil</MenuItem>
                        <MenuItem value='BRN'>Brunei Darussalam</MenuItem>
                        <MenuItem value='BGR'>Bulgaria</MenuItem>
                        <MenuItem value='BFA'>Burkina Faso</MenuItem>
                        <MenuItem value='BDI'>Burundi</MenuItem>
                        <MenuItem value='KHM'>Cambodia</MenuItem>
                        <MenuItem value='CMR'>Cameroon</MenuItem>
                        <MenuItem value='CAN'>Canada</MenuItem>
                        <MenuItem value='CPV'>Cabo Verde</MenuItem>
                        <MenuItem value='CAF'>Central African Republic</MenuItem>
                        <MenuItem value='TCD'>Chad</MenuItem>
                        <MenuItem value='CHL'>Chile</MenuItem>
                        <MenuItem value='CHN'>China</MenuItem>
                        <MenuItem value='COL'>Colombia</MenuItem>
                        <MenuItem value='COM'>Comoros</MenuItem>
                        <MenuItem value='COG'>Congo</MenuItem>
                        <MenuItem value='COD'>Congo, the Democratic Republic of the</MenuItem>
                        <MenuItem value='CRI'>Costa Rica</MenuItem>
                        <MenuItem value='CIV'>Côte d'Ivoire</MenuItem>
                        <MenuItem value='HRV'>Croatia</MenuItem>
                        <MenuItem value='CUB'>Cuba</MenuItem>
                        <MenuItem value='CYP'>Cyprus</MenuItem>
                        <MenuItem value='CZE'>Czechia</MenuItem>
                        <MenuItem value='DNK'>Denmark</MenuItem>
                        <MenuItem value='DJI'>Djibouti</MenuItem>
                        <MenuItem value='DMA'>Dominica</MenuItem>
                        <MenuItem value='DOM'>Dominican Republic</MenuItem>
                        <MenuItem value='ECU'>Ecuador</MenuItem>
                        <MenuItem value='EGY'>Egypt</MenuItem>
                        <MenuItem value='SLV'>El Salvador</MenuItem>
                        <MenuItem value='GNQ'>Equatorial Guinea</MenuItem>
                        <MenuItem value='ERI'>Eritrea</MenuItem>
                        <MenuItem value='EST'>Estonia</MenuItem>
                        <MenuItem value='ETH'>Ethiopia</MenuItem>
                        <MenuItem value='FJI'>Fiji</MenuItem>
                        <MenuItem value='FIN'>Finland</MenuItem>
                        <MenuItem value='FRA'>France</MenuItem>
                        <MenuItem value='GAB'>Gabon</MenuItem>
                        <MenuItem value='GMB'>Gambia</MenuItem>
                        <MenuItem value='GEO'>Georgia</MenuItem>
                        <MenuItem value='DEU'>Germany</MenuItem>
                        <MenuItem value='GHA'>Ghana</MenuItem>
                        <MenuItem value='GRC'>Greece</MenuItem>
                        <MenuItem value='GRD'>Grenada</MenuItem>
                        <MenuItem value='GTM'>Guatemala</MenuItem>
                        <MenuItem value='GIN'>Guinea</MenuItem>
                        <MenuItem value='GNB'>Guinea-Bissau</MenuItem>
                        <MenuItem value='GUY'>Guyana</MenuItem>
                        <MenuItem value='HTI'>Haiti</MenuItem>
                        <MenuItem value='VAT'>Holy See (Vatican City State)</MenuItem>
                        <MenuItem value='HND'>Honduras</MenuItem>
                        <MenuItem value='HUN'>Hungary</MenuItem>
                        <MenuItem value='ISL'>Iceland</MenuItem>
                        <MenuItem value='IND'>India</MenuItem>
                        <MenuItem value='IDN'>Indonesia</MenuItem>
                        <MenuItem value='IRN'>Iran, Islamic Republic of</MenuItem>
                        <MenuItem value='IRQ'>Iraq</MenuItem>
                        <MenuItem value='IRL'>Ireland</MenuItem>
                        <MenuItem value='ISR'>Israel</MenuItem>
                        <MenuItem value='ITA'>Italy</MenuItem>
                        <MenuItem value='JAM'>Jamaica</MenuItem>
                        <MenuItem value='JPN'>Japan</MenuItem>
                        <MenuItem value='JOR'>Jordan</MenuItem>
                        <MenuItem value='KAZ'>Kazakhstan</MenuItem>
                        <MenuItem value='KEN'>Kenya</MenuItem>
                        <MenuItem value='KIR'>Kiribati</MenuItem>
                        <MenuItem value='KOR'>Korea, Republic of</MenuItem>
                        <MenuItem value='KWT'>Kuwait</MenuItem>
                        <MenuItem value='KGZ'>Kyrgyzstan</MenuItem>
                        <MenuItem value='LAO'>Lao People's Democratic Republic</MenuItem>
                        <MenuItem value='LVA'>Latvia</MenuItem>
                        <MenuItem value='LBN'>Lebanon</MenuItem>
                        <MenuItem value='LSO'>Lesotho</MenuItem>
                        <MenuItem value='LBR'>Liberia</MenuItem>
                        <MenuItem value='LBY'>Libya</MenuItem>
                        <MenuItem value='LIE'>Liechtenstein</MenuItem>
                        <MenuItem value='LTU'>Lithuania</MenuItem>
                        <MenuItem value='LUX'>Luxembourg</MenuItem>
                        <MenuItem value='MKD'>North Macedonia, The Republic of</MenuItem>
                        <MenuItem value='MDG'>Madagascar</MenuItem>
                        <MenuItem value='MWI'>Malawi</MenuItem>
                        <MenuItem value='MYS'>Malaysia</MenuItem>
                        <MenuItem value='MDV'>Maldives</MenuItem>
                        <MenuItem value='MLI'>Mali</MenuItem>
                        <MenuItem value='MLT'>Malta</MenuItem>
                        <MenuItem value='MHL'>Marshall Islands</MenuItem>
                        <MenuItem value='MRT'>Mauritania</MenuItem>
                        <MenuItem value='MUS'>Mauritius</MenuItem>
                        <MenuItem value='MEX'>Mexico</MenuItem>
                        <MenuItem value='FSM'>Micronesia, Federated States of</MenuItem>
                        <MenuItem value='MDA'>Moldova, Republic of</MenuItem>
                        <MenuItem value='MCO'>Monaco</MenuItem>
                        <MenuItem value='MNG'>Mongolia</MenuItem>
                        <MenuItem value='MNE'>Montenegro</MenuItem>
                        <MenuItem value='MAR'>Morocco</MenuItem>
                        <MenuItem value='MOZ'>Mozambique</MenuItem>
                        <MenuItem value='MMR'>Myanmar</MenuItem>
                        <MenuItem value='NAM'>Namibia</MenuItem>
                        <MenuItem value='NRU'>Nauru</MenuItem>
                        <MenuItem value='NPL'>Nepal</MenuItem>
                        <MenuItem value='NLD'>Netherlands</MenuItem>
                        <MenuItem value='NZL'>New Zealand</MenuItem>
                        <MenuItem value='NIC'>Nicaragua</MenuItem>
                        <MenuItem value='NER'>Niger</MenuItem>
                        <MenuItem value='NGA'>Nigeria</MenuItem>
                        <MenuItem value='NOR'>Norway</MenuItem>
                        <MenuItem value='OMN'>Oman</MenuItem>
                        <MenuItem value='PAK'>Pakistan</MenuItem>
                        <MenuItem value='PLW'>Palau</MenuItem>
                        <MenuItem value='PSE'>Palestine, State of</MenuItem>
                        <MenuItem value='PAN'>Panama</MenuItem>
                        <MenuItem value='PNG'>Papua New Guinea</MenuItem>
                        <MenuItem value='PRY'>Paraguay</MenuItem>
                        <MenuItem value='PER'>Peru</MenuItem>
                        <MenuItem value='PHL'>Philippines</MenuItem>
                        <MenuItem value='POL'>Poland</MenuItem>
                        <MenuItem value='PRT'>Portugal</MenuItem>
                        <MenuItem value='QAT'>Qatar</MenuItem>
                        <MenuItem value='ROU'>Romania</MenuItem>
                        <MenuItem value='RUS'>Russian Federation</MenuItem>
                        <MenuItem value='RWA'>Rwanda</MenuItem>
                        <MenuItem value='KNA'>Saint Kitts and Nevis</MenuItem>
                        <MenuItem value='LCA'>Saint Lucia</MenuItem>
                        <MenuItem value='VCT'>Saint Vincent and the Grenadines</MenuItem>
                        <MenuItem value='WSM'>Samoa</MenuItem>
                        <MenuItem value='SMR'>San Marino</MenuItem>
                        <MenuItem value='STP'>Sao Tome and Principe</MenuItem>
                        <MenuItem value='SAU'>Saudi Arabia</MenuItem>
                        <MenuItem value='SEN'>Senegal</MenuItem>
                        <MenuItem value='SRB'>Serbia</MenuItem>
                        <MenuItem value='SYC'>Seychelles</MenuItem>
                        <MenuItem value='SLE'>Sierra Leone</MenuItem>
                        <MenuItem value='SGP'>Singapore</MenuItem>
                        <MenuItem value='SVK'>Slovakia</MenuItem>
                        <MenuItem value='SVN'>Slovenia</MenuItem>
                        <MenuItem value='SLB'>Solomon Islands</MenuItem>
                        <MenuItem value='SOM'>Somalia</MenuItem>
                        <MenuItem value='ZAF'>South Africa</MenuItem>
                        <MenuItem value='SSD'>South Sudan</MenuItem>
                        <MenuItem value='ESP'>Spain</MenuItem>
                        <MenuItem value='LKA'>Sri Lanka</MenuItem>
                        <MenuItem value='SDN'>Sudan</MenuItem>
                        <MenuItem value='SUR'>Suriname</MenuItem>
                        <MenuItem value='SWZ'>Swaziland</MenuItem>
                        <MenuItem value='SWE'>Sweden</MenuItem>
                        <MenuItem value='CHE'>Switzerland</MenuItem>
                        <MenuItem value='SYR'>Syrian Arab Republic</MenuItem>
                        <MenuItem value='TWN'>Taiwan, Province of China</MenuItem>
                        <MenuItem value='TJK'>Tajikistan</MenuItem>
                        <MenuItem value='TZA'>Tanzania, United Republic of</MenuItem>
                        <MenuItem value='THA'>Thailand</MenuItem>
                        <MenuItem value='TLS'>Timor-Leste</MenuItem>
                        <MenuItem value='TGO'>Togo</MenuItem>
                        <MenuItem value='TON'>Tonga</MenuItem>
                        <MenuItem value='TTO'>Trinidad and Tobago</MenuItem>
                        <MenuItem value='TUN'>Tunisia</MenuItem>
                        <MenuItem value='TUR'>Turkey</MenuItem>
                        <MenuItem value='TKM'>Turkmenistan</MenuItem>
                        <MenuItem value='TUV'>Tuvalu</MenuItem>
                        <MenuItem value='UGA'>Uganda</MenuItem>
                        <MenuItem value='UKR'>Ukraine</MenuItem>
                        <MenuItem value='ARE'>United Arab Emirates</MenuItem>
                        <MenuItem value='GBR'>United Kingdom</MenuItem>
                        <MenuItem value='USA'>United States</MenuItem>
                        <MenuItem value='URY'>Uruguay</MenuItem>
                        <MenuItem value='UZB'>Uzbekistan</MenuItem>
                        <MenuItem value='VUT'>Vanuatu</MenuItem>
                        <MenuItem value='VEN'>Venezuela, Bolivarian Republic of</MenuItem>
                        <MenuItem value='VNM'>Viet Nam</MenuItem>
                        <MenuItem value='ESH'>Western Sahara</MenuItem>
                        <MenuItem value='YEM'>Yemen</MenuItem>
                        <MenuItem value='ZMB'>Zambia</MenuItem>
                        <MenuItem value='ZWE'>Zimbabwe</MenuItem>
                    </Select>
                    {props.model.identification.countryCode === "" ?
                        <FormHelperText>Please select your issuing country</FormHelperText> : <></>}
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField name="documentNumber" label="Number" variant="outlined"
                        value={props.model.identification.documentNumber}
                        onChange={event => props.handleIdentificationChange(event)}
                        error={props.model.identification.documentNumber === ""}
                        helperText={props.model.identification.documentNumber === "" ? 'Please provide your document number' : false}
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField name="cardNumber" label="Card Type / Version" variant="outlined"
                        value={props.model.identification.cardNumber}
                        onChange={event => props.handleIdentificationChange(event)}
                    />
                </FormControl>

            {/*    <FormControl fullWidth margin="normal">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            form
                            name="expiryDate"
                            label="Expiry date"
                            inputFormat="dd/MM/yyyy"
                            value={props.model.identification.expiryDate}
                            onChange={(value) => props.model.identification.expiryDate = value}      
                            renderInput={(params) => <TextField {...params} />}
                            errorText="Please provide your identification expiry"
                            error={props.model.person.expiryDate === ""}
                        />
                    </LocalizationProvider>
                </FormControl>*/}


            </Box>
        </>
    );
}

export default ReviewDetails;