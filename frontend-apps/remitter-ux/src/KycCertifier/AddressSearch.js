import React from 'react';

import { TextField } from "@material-ui/core";
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { usePlacesWidget } from "react-google-autocomplete";

export default function AddressSearch(props) {           

    let apiKey = 'AIzaSyA3FDzX85FD9P5FZA1Ncl8g2C6bjdaRtug';

    const { ref: materialRef } = usePlacesWidget({
        apiKey: apiKey,       
        onPlaceSelected: (place, inputRef) => {    
            inputRef.value = '';
            let address1 = "", city = "", state = "", postcode = "", country = "";
            for (const component of place.address_components) {
                const componentType = component.types[0];
                switch (componentType) {
                    case "street_number": {
                        if (component.long_name) {
                            address1 = `${component.long_name} ${address1}`;
                        }
                        break;
                    }
                    case "route": {
                        if (component.long_name) {
                            address1 += component.long_name;
                        }
                        break;
                    }
                    case "postal_code": {
                        if (component.long_name) {
                            postcode = `${component.long_name}${postcode}`;
                        }
                        break;
                    }
                    case "postal_code_suffix": {
                        if (component.long_name) {
                            postcode = `${postcode}-${component.long_name}`;
                        }
                        break;
                    }
                    case "locality":
                        if (component.long_name) {
                            city = component.long_name;
                        }
                        break;

                    case "administrative_area_level_1": {
                        if (component.short_name) {
                            state = component.short_name;
                        }
                        break;
                    }
                    case "country": {
                        if (component.short_name) {
                            country = component.short_name;
                        }
                        break;
                    }
                    default: { }
                }
            }

            props.handleAddressSearchSelect({
                address1: address1,
                address2: '',
                city: city,
                state: state,
                postcode: postcode,
                country: country?.toLowerCase()
            });

        },
        options: {
            types: ["address"]
        },
    });

    return (
        <>
            <Box component="form" sx={{ mt: 1 }} noValidate autoComplete="off">
                <FormControl fullWidth margin="normal">
                    <TextField
                        fullWidth
                        color="secondary"
                        variant="outlined"
                        inputRef={materialRef}
                        placeholder='Search for your address'                                             
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField name="address1" label="Address 1" variant="outlined"
                        value={props.address?.address1}
                        onChange={event => props.handleAddressChange(event)}
                        error={props.touched && props.address.address1 === ""}
                        helperText={props.touched && props.address?.address1 === "" ? 'Please provide the first line of your address' : false}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField name="address2" label="Address 2" variant="outlined"
                        value={props.address?.address2}
                        onChange={event => props.handleAddressChange(event)}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField name="city" label="City" variant="outlined"
                        value={props.address?.city}
                        onChange={event => props.handleAddressChange(event)}
                        error={props.touched && props.address?.city === ""}
                        helperText={props.touched && props.address?.city === "" ? 'Please provide your city' : false}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField name="state" label="State" variant="outlined"
                        value={props.address?.state}
                        onChange={event => props.handleAddressChange(event)}
                        error={props.touched && props.address?.state === ""}
                        helperText={props.touched && props.address?.city === "" ? 'Please provide your city' : false}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField name="postcode" label="Postcode" variant="outlined"
                        value={props.address?.postcode}
                        onChange={event => props.handleAddressChange(event)}
                        error={props.touched && props.address?.postcode === ""}
                        helperText={props.touched && props.address?.postcode === "" ? 'Please provide your postcode' : false}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal" error={props.touched && props.address?.country === ""}>
                    <InputLabel id="country-label">Country</InputLabel>
                    <Select
                        labelId="country-label"
                        name="country"
                        label="Country"
                        value={props.address?.country}
                        onChange={(value) => props.address.county = value}      
                    >
                        <MenuItem value='af'>Afghanistan</MenuItem>
                        <MenuItem value='al'>Albania</MenuItem>
                        <MenuItem value='dz'>Algeria</MenuItem>
                        <MenuItem value='as'>American Samoa</MenuItem>
                        <MenuItem value='ad'>Andorra</MenuItem>
                        <MenuItem value='ao'>Angola</MenuItem>
                        <MenuItem value='ai'>Anguilla</MenuItem>
                        <MenuItem value='aq'>Antarctica</MenuItem>
                        <MenuItem value='ag'>Antigua and Barbuda</MenuItem>
                        <MenuItem value='ar'>Argentina</MenuItem>
                        <MenuItem value='am'>Armenia</MenuItem>
                        <MenuItem value='aw'>Aruba</MenuItem>
                        <MenuItem value='au'>Australia</MenuItem>
                        <MenuItem value='at'>Austria</MenuItem>
                        <MenuItem value='az'>Azerbaijan</MenuItem>
                        <MenuItem value='bs'>Bahamas</MenuItem>
                        <MenuItem value='bh'>Bahrain</MenuItem>
                        <MenuItem value='bd'>Bangladesh</MenuItem>
                        <MenuItem value='bb'>Barbados</MenuItem>
                        <MenuItem value='by'>Belarus</MenuItem>
                        <MenuItem value='be'>Belgium</MenuItem>
                        <MenuItem value='bz'>Belize</MenuItem>
                        <MenuItem value='bj'>Benin</MenuItem>
                        <MenuItem value='bm'>Bermuda</MenuItem>
                        <MenuItem value='bt'>Bhutan</MenuItem>
                        <MenuItem value='bo'>Bolivia</MenuItem>
                        <MenuItem value='ba'>Bosnia and Herzegovina</MenuItem>
                        <MenuItem value='bw'>Botswana</MenuItem>
                        <MenuItem value='bv'>Bouvet Island</MenuItem>
                        <MenuItem value='br'>Brazil</MenuItem>
                        <MenuItem value='io'>British Indian Ocean Territory</MenuItem>
                        <MenuItem value='bn'>Brunei Darussalam</MenuItem>
                        <MenuItem value='bg'>Bulgaria</MenuItem>
                        <MenuItem value='bf'>Burkina Faso</MenuItem>
                        <MenuItem value='bi'>Burundi</MenuItem>
                        <MenuItem value='kh'>Cambodia</MenuItem>
                        <MenuItem value='cm'>Cameroon</MenuItem>
                        <MenuItem value='ca'>Canada</MenuItem>
                        <MenuItem value='cv'>Cape Verde</MenuItem>
                        <MenuItem value='ky'>Cayman Islands</MenuItem>
                        <MenuItem value='cf'>Central African Republic</MenuItem>
                        <MenuItem value='td'>Chad</MenuItem>
                        <MenuItem value='cl'>Chile</MenuItem>
                        <MenuItem value='cn'>China</MenuItem>
                        <MenuItem value='cx'>Christmas Island</MenuItem>
                        <MenuItem value='cc'>Cocos (Keeling) Islands</MenuItem>
                        <MenuItem value='co'>Colombia</MenuItem>
                        <MenuItem value='km'>Comoros</MenuItem>
                        <MenuItem value='cg'>Congo</MenuItem>
                        <MenuItem value='cd'>Congo, the Democratic Republic of the</MenuItem>
                        <MenuItem value='ck'>Cook Islands</MenuItem>
                        <MenuItem value='cr'>Costa Rica</MenuItem>
                        <MenuItem value='ci'>Cote D'ivoire</MenuItem>
                        <MenuItem value='hr'>Croatia</MenuItem>
                        <MenuItem value='cu'>Cuba</MenuItem>
                        <MenuItem value='cy'>Cyprus</MenuItem>
                        <MenuItem value='cz'>Czech Republic</MenuItem>
                        <MenuItem value='dk'>Denmark</MenuItem>
                        <MenuItem value='dj'>Djibouti</MenuItem>
                        <MenuItem value='dm'>Dominica</MenuItem>
                        <MenuItem value='do'>Dominican Republic</MenuItem>
                        <MenuItem value='ec'>Ecuador</MenuItem>
                        <MenuItem value='eg'>Egypt</MenuItem>
                        <MenuItem value='sv'>El Salvador</MenuItem>
                        <MenuItem value='gq'>Equatorial Guinea</MenuItem>
                        <MenuItem value='er'>Eritrea</MenuItem>
                        <MenuItem value='ee'>Estonia</MenuItem>
                        <MenuItem value='et'>Ethiopia</MenuItem>
                        <MenuItem value='fk'>Falkland Islands (Malvinas)</MenuItem>
                        <MenuItem value='fo'>Faroe Islands</MenuItem>
                        <MenuItem value='fj'>Fiji</MenuItem>
                        <MenuItem value='fi'>Finland</MenuItem>
                        <MenuItem value='fr'>France</MenuItem>
                        <MenuItem value='gf'>French Guiana</MenuItem>
                        <MenuItem value='pf'>French Polynesia</MenuItem>
                        <MenuItem value='tf'>French Southern Territories</MenuItem>
                        <MenuItem value='ga'>Gabon</MenuItem>
                        <MenuItem value='gm'>Gambia</MenuItem>
                        <MenuItem value='ge'>Georgia</MenuItem>
                        <MenuItem value='de'>Germany</MenuItem>
                        <MenuItem value='gh'>Ghana</MenuItem>
                        <MenuItem value='gi'>Gibraltar</MenuItem>
                        <MenuItem value='gr'>Greece</MenuItem>
                        <MenuItem value='gl'>Greenland</MenuItem>
                        <MenuItem value='gd'>Grenada</MenuItem>
                        <MenuItem value='gp'>Guadeloupe</MenuItem>
                        <MenuItem value='gu'>Guam</MenuItem>
                        <MenuItem value='gt'>Guatemala</MenuItem>
                        <MenuItem value='gn'>Guinea</MenuItem>
                        <MenuItem value='gw'>Guinea-Bissau</MenuItem>
                        <MenuItem value='gy'>Guyana</MenuItem>
                        <MenuItem value='ht'>Haiti</MenuItem>
                        <MenuItem value='hm'>Heard Island and Mcdonald Islands</MenuItem>
                        <MenuItem value='va'>Holy See (Vatican City State)</MenuItem>
                        <MenuItem value='hn'>Honduras</MenuItem>
                        <MenuItem value='hk'>Hong Kong</MenuItem>
                        <MenuItem value='hu'>Hungary</MenuItem>
                        <MenuItem value='is'>Iceland</MenuItem>
                        <MenuItem value='in'>India</MenuItem>
                        <MenuItem value='id'>Indonesia</MenuItem>
                        <MenuItem value='ir'>Iran, Islamic Republic of</MenuItem>
                        <MenuItem value='iq'>Iraq</MenuItem>
                        <MenuItem value='ie'>Ireland</MenuItem>
                        <MenuItem value='il'>Israel</MenuItem>
                        <MenuItem value='it'>Italy</MenuItem>
                        <MenuItem value='jm'>Jamaica</MenuItem>
                        <MenuItem value='jp'>Japan</MenuItem>
                        <MenuItem value='jo'>Jordan</MenuItem>
                        <MenuItem value='kz'>Kazakhstan</MenuItem>
                        <MenuItem value='ke'>Kenya</MenuItem>
                        <MenuItem value='ki'>Kiribati</MenuItem>
                        <MenuItem value='kp'>Korea, Democratic People's Republic of</MenuItem>
                        <MenuItem value='kr'>Korea, Republic of</MenuItem>
                        <MenuItem value='kw'>Kuwait</MenuItem>
                        <MenuItem value='kg'>Kyrgyzstan</MenuItem>
                        <MenuItem value='la'>Lao People's Democratic Republic</MenuItem>
                        <MenuItem value='lv'>Latvia</MenuItem>
                        <MenuItem value='lb'>Lebanon</MenuItem>
                        <MenuItem value='ls'>Lesotho</MenuItem>
                        <MenuItem value='lr'>Liberia</MenuItem>
                        <MenuItem value='ly'>Libyan Arab Jamahiriya</MenuItem>
                        <MenuItem value='li'>Liechtenstein</MenuItem>
                        <MenuItem value='lt'>Lithuania</MenuItem>
                        <MenuItem value='lu'>Luxembourg</MenuItem>
                        <MenuItem value='mo'>Macao</MenuItem>
                        <MenuItem value='mk'>Macedonia, the Former Yugosalv Republic of</MenuItem>
                        <MenuItem value='mg'>Madagascar</MenuItem>
                        <MenuItem value='mw'>Malawi</MenuItem>
                        <MenuItem value='my'>Malaysia</MenuItem>
                        <MenuItem value='mv'>Maldives</MenuItem>
                        <MenuItem value='ml'>Mali</MenuItem>
                        <MenuItem value='mt'>Malta</MenuItem>
                        <MenuItem value='mh'>Marshall Islands</MenuItem>
                        <MenuItem value='mq'>Martinique</MenuItem>
                        <MenuItem value='mr'>Mauritania</MenuItem>
                        <MenuItem value='mu'>Mauritius</MenuItem>
                        <MenuItem value='yt'>Mayotte</MenuItem>
                        <MenuItem value='mx'>Mexico</MenuItem>
                        <MenuItem value='fm'>Micronesia, Federated States of</MenuItem>
                        <MenuItem value='md'>Moldova, Republic of</MenuItem>
                        <MenuItem value='mc'>Monaco</MenuItem>
                        <MenuItem value='mn'>Mongolia</MenuItem>
                        <MenuItem value='ms'>Montserrat</MenuItem>
                        <MenuItem value='ma'>Morocco</MenuItem>
                        <MenuItem value='mz'>Mozambique</MenuItem>
                        <MenuItem value='mm'>Myanmar</MenuItem>
                        <MenuItem value='na'>Namibia</MenuItem>
                        <MenuItem value='nr'>Nauru</MenuItem>
                        <MenuItem value='np'>Nepal</MenuItem>
                        <MenuItem value='nl'>Netherlands</MenuItem>
                        <MenuItem value='an'>Netherlands Antilles</MenuItem>
                        <MenuItem value='nc'>New Caledonia</MenuItem>
                        <MenuItem value='nz'>New Zealand</MenuItem>
                        <MenuItem value='ni'>Nicaragua</MenuItem>
                        <MenuItem value='ne'>Niger</MenuItem>
                        <MenuItem value='ng'>Nigeria</MenuItem>
                        <MenuItem value='nu'>Niue</MenuItem>
                        <MenuItem value='nf'>Norfolk Island</MenuItem>
                        <MenuItem value='mp'>Northern Mariana Islands</MenuItem>
                        <MenuItem value='no'>Norway</MenuItem>
                        <MenuItem value='om'>Oman</MenuItem>
                        <MenuItem value='pk'>Pakistan</MenuItem>
                        <MenuItem value='pw'>Palau</MenuItem>
                        <MenuItem value='ps'>Palestinian Territory, Occupied</MenuItem>
                        <MenuItem value='pa'>Panama</MenuItem>
                        <MenuItem value='pg'>Papua New Guinea</MenuItem>
                        <MenuItem value='py'>Paraguay</MenuItem>
                        <MenuItem value='pe'>Peru</MenuItem>
                        <MenuItem value='ph'>Philippines</MenuItem>
                        <MenuItem value='pn'>Pitcairn</MenuItem>
                        <MenuItem value='pl'>Poland</MenuItem>
                        <MenuItem value='pt'>Portugal</MenuItem>
                        <MenuItem value='pr'>Puerto Rico</MenuItem>
                        <MenuItem value='qa'>Qatar</MenuItem>
                        <MenuItem value='re'>Reunion</MenuItem>
                        <MenuItem value='ro'>Romania</MenuItem>
                        <MenuItem value='ru'>Russian Federation</MenuItem>
                        <MenuItem value='rw'>Rwanda</MenuItem>
                        <MenuItem value='sh'>Saint Helena</MenuItem>
                        <MenuItem value='kn'>Saint Kitts and Nevis</MenuItem>
                        <MenuItem value='lc'>Saint Lucia</MenuItem>
                        <MenuItem value='pm'>Saint Pierre and Miquelon</MenuItem>
                        <MenuItem value='vc'>Saint Vincent and the Grenadines</MenuItem>
                        <MenuItem value='ws'>Samoa</MenuItem>
                        <MenuItem value='sm'>San Marino</MenuItem>
                        <MenuItem value='st'>Sao Tome and Principe</MenuItem>
                        <MenuItem value='sa'>Saudi Arabia</MenuItem>
                        <MenuItem value='sn'>Senegal</MenuItem>
                        <MenuItem value='cs'>Serbia and Montenegro</MenuItem>
                        <MenuItem value='sc'>Seychelles</MenuItem>
                        <MenuItem value='sl'>Sierra Leone</MenuItem>
                        <MenuItem value='sg'>Singapore</MenuItem>
                        <MenuItem value='sk'>Slovakia</MenuItem>
                        <MenuItem value='si'>Slovenia</MenuItem>
                        <MenuItem value='sb'>Solomon Islands</MenuItem>
                        <MenuItem value='so'>Somalia</MenuItem>
                        <MenuItem value='za'>South Africa</MenuItem>
                        <MenuItem value='gs'>South Georgia and the South Sandwich Islands</MenuItem>
                        <MenuItem value='es'>Spain</MenuItem>
                        <MenuItem value='lk'>Sri Lanka</MenuItem>
                        <MenuItem value='sd'>Sudan</MenuItem>
                        <MenuItem value='sr'>Suriname</MenuItem>
                        <MenuItem value='sj'>Svalbard and Jan Mayen</MenuItem>
                        <MenuItem value='sz'>Swaziland</MenuItem>
                        <MenuItem value='se'>Sweden</MenuItem>
                        <MenuItem value='ch'>Switzerland</MenuItem>
                        <MenuItem value='sy'>Syrian Arab Republic</MenuItem>
                        <MenuItem value='tw'>Taiwan, Province of China</MenuItem>
                        <MenuItem value='tj'>Tajikistan</MenuItem>
                        <MenuItem value='tz'>Tanzania, United Republic of</MenuItem>
                        <MenuItem value='th'>Thailand</MenuItem>
                        <MenuItem value='tl'>Timor-Leste</MenuItem>
                        <MenuItem value='tg'>Togo</MenuItem>
                        <MenuItem value='tk'>Tokelau</MenuItem>
                        <MenuItem value='to'>Tonga</MenuItem>
                        <MenuItem value='tt'>Trinidad and Tobago</MenuItem>
                        <MenuItem value='tn'>Tunisia</MenuItem>
                        <MenuItem value='tr'>Turkey</MenuItem>
                        <MenuItem value='tm'>Turkmenistan</MenuItem>
                        <MenuItem value='tc'>Turks and Caicos Islands</MenuItem>
                        <MenuItem value='tv'>Tuvalu</MenuItem>
                        <MenuItem value='ug'>Uganda</MenuItem>
                        <MenuItem value='ua'>Ukraine</MenuItem>
                        <MenuItem value='ae'>United Arab Emirates</MenuItem>
                        <MenuItem value='uk'>United Kingdom</MenuItem>
                        <MenuItem value='us'>United States</MenuItem>
                        <MenuItem value='um'>United States Minor Outlying Islands</MenuItem>
                        <MenuItem value='uy'>Uruguay</MenuItem>
                        <MenuItem value='uz'>Uzbekistan</MenuItem>
                        <MenuItem value='vu'>Vanuatu</MenuItem>
                        <MenuItem value='ve'>Venezuela</MenuItem>
                        <MenuItem value='vn'>Viet Nam</MenuItem>
                        <MenuItem value='vg'>Virgin Islands, British</MenuItem>
                        <MenuItem value='vi'>Virgin Islands, U.S.</MenuItem>
                        <MenuItem value='wf'>Wallis and Futuna</MenuItem>
                        <MenuItem value='eh'>Western Sahara</MenuItem>
                        <MenuItem value='ye'>Yemen</MenuItem>
                        <MenuItem value='zm'>Zambia</MenuItem>
                        <MenuItem value='zw'>Zimbabwe</MenuItem>
                    </Select>
                    {props.touched && props.address?.country === "" ?
                        <FormHelperText>Please select your country</FormHelperText> : <></>}
                </FormControl>
            </Box>

        </>
    );
}
