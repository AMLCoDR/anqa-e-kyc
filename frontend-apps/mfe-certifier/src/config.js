
const dev = {
    apiUrl: 'https://api-stg.anqaml.com',
    auth0: {
        domain: "anqa-stg.au.auth0.com",
        clientId: "bWUOO1Wy2oA2CPm2s7iGrjVC1wb7IzZT",
        audience: "anqaml-stg.com"
    },
    ldId: '609258e94787e324aa30c489',
    mixpanelId: '31705509ac5d5be74316c4c42495d5c1',
    instana: {
        url: 'https://eum-orange-saas.instana.io',
        key: 'yIQ8pOxQSaGlCVUxgt_BuA'
    }
};

const prd = {
    apiUrl: 'https://api.anqaml.com',
    auth0: {
        domain: "anqa.au.auth0.com",
        clientId: "yGla8ER25ZkEqookUG6kvjuzx6JyJmqy",
        audience: "anqaml.com"
    },
    ldId: '609258e94787e324aa30c48a',
    mixpanelId: '5b2337d13d2877fa9ddb3f2ab4983e99',
    instana: {
        url: 'https://eum-orange-saas.instana.io',
        key: 's3b8nIB3SWCFizPFC9trDQ'
    }
};

const config = {
    elevioId: '603567f8d4b0e',
    maxUploadSize: 10000000,
    webUrl: 'https://www.anqaml.com',
    ...(process.env.REACT_APP_STAGE === "prd" ? prd : dev)
}

export default config;