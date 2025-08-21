import _ from 'lodash';

const isNonEmptyString = val => {
    return _.isString(val) && val.trim().length > 0;
};

export const isDetailValid = org => {
    return org && isNonEmptyString(org.name);
};

export const isNatureValid = org => {
    return org && isNonEmptyString(org.useOfId) && isNonEmptyString(org.nature);
};

export const isInfoSecValid = org => {
    return org &&
        org.agreeInfoSecurity &&
        org.agreeRiskManagement &&
        org.hasBreachProcess &&
        org.hasPrivacyPolicy &&
        isNonEmptyString(org.privacyPolicyDocId);
};

export const isConsentValid = org => {
    return org &&
        org.hasConsentWording &&
        org.seekConsent &&
        isNonEmptyString(org.consentFormDocId);
};

