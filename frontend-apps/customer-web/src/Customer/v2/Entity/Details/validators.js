const isNonEmptyString = val => {
    if ((val !== undefined) && (val !== null) && (typeof val === 'string') && (val.trim().length > 0)) {
        return true;
    }
    return false;
};

export const isPersonValid = customer => {
    return customer &&
        isNonEmptyString(customer.getFirstName()) &&
        isNonEmptyString(customer.getLastName()) &&
        isNonEmptyString(customer.getBirthDate()) &&
        isNonEmptyString(customer.getCountry());
};

export const isPurposeValid = customer => {
    return customer && isNonEmptyString(customer.getPurpose());
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