
const dev = {
    apiUrl: 'https://api-stg.anqaml.com',
};

const prd = {
    apiUrl: 'https://api.anqaml.com',
};

const config = {
    maxUploadSize: 10000000,
    ...(process.env.REACT_APP_STAGE === "prd" ? prd : dev)
}

export default config;