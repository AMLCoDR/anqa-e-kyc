import { enums } from '@optimizely/react-sdk'

// Environment-specific variables are set by the CD pipeline
// In this case Netlify

const envs = {
    'dev': {
        apiUrl: 'https://api-stg.anqaml.com',
        appUrl: 'http://localhost:3001',

        contentful: {
            deliveryToken: 'SDfDMJDcm9BTtQqkb6ET6ZxxLcCNU1KqK3ZYjBogIcM',
            previewToken: 'PArWr0aN2FSxTjXgEH4olg_PiCPd4-TVB9I8Gpl_OlM',
        },
        ga: {
            code: 'UA-00000000-0'
        },
        optimizely: {
            key: '7BgiFqHSCVqRHjhGvWosz',
            loglevel: enums.LOG_LEVEL.INFO
        },
        auth0: {
            domain: "anqa-stg.au.auth0.com",
            clientId: "bWUOO1Wy2oA2CPm2s7iGrjVC1wb7IzZT",
            audience: "anqaml-stg.com"
        },
    },
    'stg': {
        apiUrl: 'https://api-stg.anqaml.com',
        appUrl: 'https://app-stg.anqaml.com',
        auth0: {
            domain: "anqa-stg.au.auth0.com",
            clientId: "bWUOO1Wy2oA2CPm2s7iGrjVC1wb7IzZT",
            audience: "anqaml-stg.com"
        },
    },
    'prd': {
        apiUrl: 'https://api.anqaml.com',
        appUrl: 'https://app.anqaml.com',
    },
}

// merge environment-specifc config
const env = envs[process.env.REACT_APP_STAGE || 'dev'];

export default {
    siteName: 'Avid AML',
    apiUrl: env.apiUrl,
    appUrl: env.appUrl,
    signUpToken: process.env.REACT_APP_SIGN_UP_TOKEN || 'allow',

    activeCampaign: {
        formSubmit: 'https://anqaml.activehosted.com/proc.php'
    },
    auth0: {
        domain: "anqa.au.auth0.com",
        clientId: "yGla8ER25ZkEqookUG6kvjuzx6JyJmqy",
        audience: "anqaml.com",
        ...env.auth0
    },
    contentful: {
        spaceId: 'vkm1wfgj4opj',
        environment: 'master',
        deliveryToken: process.env.REACT_APP_CF_DELIVERY_TOKEN,
        previewToken: process.env.REACT_APP_CF_PREVIEW_TOKEN,
        ...env.contentful
    },
    ga: {
        code: 'UA-150984906-1'
    },
    optimizely: {
        key: '2paB5bdqxwVVW7JoZjVbT',
        loglevel: enums.LOG_LEVEL.NOTSET,
        ...env.optimizely
    },
};
