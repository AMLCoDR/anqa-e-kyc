import React, { useEffect } from 'react';

import * as PropTypes from 'prop-types';
import ReactGA from 'react-ga';
// import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

import JsonLd from '../../components/JsonLd';
import config from '../../config';

export const Tracker = ({ content, children }) => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        ReactGA.pageview(location.pathname);
    }, [location]);

    return (
        <>
            {content &&
                <>
                    <meta charSet="utf-8" />
                    <title>{content.fields.title ? `${content.fields.title} - ` : ''}{config.siteName}</title>
                    <meta name="description" content={content.fields.description} />
                    <link rel="canonical" href={location.pathname} />
                    <JsonLd data={content} />
                </>

            }
            {children}
        </>
    );
};

Tracker.propTypes = {
    content: PropTypes.object,
    children: PropTypes.array,
};
Tracker.defaultProps = {};