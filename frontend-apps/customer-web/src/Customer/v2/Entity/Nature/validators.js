const isNonEmptyString = val => {
    if ((val !== undefined) && (val !== null) && (typeof val === 'string') && (val.trim().length > 0)) {
        return true;
    }
    return false;
};

export const isCountryValid = customer => {
    return customer &&
        isNonEmptyString(customer.getRegCountry()) &&
        isNonEmptyString(customer.getBusCountry());
};

export const isProductValid = customer => {
    return customer && isNonEmptyString(customer.getAccessMethod())
};

export const isInstitutionValid = customer => {
    return customer &&
        isNonEmptyString(customer.getExposureUnregulated()) &&
        isNonEmptyString(customer.getExposureShellCo()) &&
        isNonEmptyString(customer.getExposureShellBank());
};
