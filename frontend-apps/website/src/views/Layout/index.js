import React, { useEffect } from 'react';

import Container from '@material-ui/core/Container';
import { useLocation } from 'react-router-dom';

import { Footer } from './Footer';
import { Header } from './Header';

export const Layout = props => {
    const location = useLocation();

    // Safari doesn't support hash navigation so we manually implement it here.
    useEffect(() => {
        const { hash } = location;
        if (hash) {
            const el = document.getElementById(hash.slice(1));
            if (el) {
                if (el.scrollIntoViewIfNeeded) {
                    el.scrollIntoViewIfNeeded();
                } else {
                    el.scrollIntoView();
                }
            }
        }
    }, [location])

    return (
        <>
            <Header />
            <Container maxWidth="lg" sx={{ mt: 10, minHeight: 'calc(100vh - 330px)' }}>
                {props.children}
            </Container>
            <Footer />
        </>
    );
};
