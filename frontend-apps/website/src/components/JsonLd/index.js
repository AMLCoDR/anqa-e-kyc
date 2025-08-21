import React from 'react';

import PropTypes from 'prop-types';

const formatStructuredData = data => {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "NGO",
        "name": "Avid AML",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Auckland",
          "postalCode": "1010",
          "streetAddress": "34 Drake St"
        },
        "email": "info(at)anqaml.com",
        "funder": {
            "@type": "Organization",
            "name": "Propellerhead LTD",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Auckland",
                "postalCode": "1010",
                "streetAddress": "34 Drake St"
            },
            "telephone": "+64 9 309 6595",
            "email": "info@propellerhead.co.nz"
        },
        "areaServed": {
            "addressCountry": "NZ"
        }
    };
    
    return JSON.stringify({
        ...structuredData,
        ...data.metadata,
    });
}

// Schemas must follow https://schema.org/ guidelines.
const JsonLd = ({ data }) => (
    <script key="json-structured-data" type="application/ld+json">
        {formatStructuredData(data)}
    </script>
);

JsonLd.propTypes = {
    data: PropTypes.object.isRequired,
};

export default JsonLd;