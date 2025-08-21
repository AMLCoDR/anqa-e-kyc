import { useState, useEffect } from 'react';

import { createClient } from 'contentful';

import config from '../config';

// useMenu fetches top nav menu items
export const useMenu = () => {
    const [menu, setMenu] = useState({ error: null });

    useEffect(() => {
        const fetch = async () => {
            try {
                const resp = await pubApi.getEntries({ content_type: 'assembly', 'fields.slug': 'site-root', include: 1 }); //locale,
                setMenu({ menuItems: resp.items[0].fields.blocks, error: null });
            } catch (e) {
                console.error(e);
                setMenu({ menuItems: null, error: { status: 500, msg: 'An issue occurred while menu items.' } });
            }
        };

        fetch();
    }, []);

    return menu
}

// useView fetches view content - is used by all content rendering
export const useView = (type, slug) => {
    const [view, setView] = useState({ error: null });

    useEffect(() => {
        const fetch = async (type, slug) => {
            try {
                // get content for view or preview
                const getContent = async () => {
                    if (type !== "preview") {
                        const resp = await pubApi.getEntries({ content_type: type, 'fields.slug': slug, include: 3 }); //locale,
                        if (resp.items.length > 0) {
                            return resp.items[0];
                        }
                    } else {
                        return await preApi.getEntry(slug, { include: 3 });
                    }
                }

                const resp = await getContent();
                if (resp) {
                    setView({ content: resp, error: null });
                } else {
                    setView({ content: null, error: { status: 404, msg: 'No matching content' } });
                }
            } catch (e) {
                // console.error(e);
                setView({ content: null, error: { status: 500, msg: 'An issue occurred while fetching page content.' } });
            }
        };

        fetch(type, slug);
    }, [type, slug]);

    return view
}

// useFooter fetches footer-specific content
export const useFooter = () => {
    const [footer, setFooter] = useState({ error: null });

    useEffect(() => {
        const fetch = async () => {
            try {
                const resp = await pubApi.getEntries({ content_type: 'resourceSet', 'fields.name': 'footer', include: 2 });
                if (resp.items.length > 0) {
                    setFooter({ footerItems: resp.items[0].fields.resources, error: null });
                } else {
                    setFooter({ footerItems: null, error: null });
                }
            } catch (e) {
                console.error(e);
                setFooter({ footerItems: null, error: { status: 500, msg: 'An issue occurred while fetching footer content.' } });
            }
        };

        fetch();
    }, []);

    return footer
}

const pubApi = createClient({
    space: config.contentful.spaceId,
    environment: config.contentful.environment,
    accessToken: config.contentful.deliveryToken,
    host: 'https://cdn.contentful.com',
    removeUnresolved: true
})

const preApi = createClient({
    space: config.contentful.spaceId,
    environment: config.contentful.environment,
    accessToken: config.contentful.previewToken,
    // host: 'preview.contentful.com',
    host: 'https://cdn.contentful.com',
    removeUnresolved: true
})