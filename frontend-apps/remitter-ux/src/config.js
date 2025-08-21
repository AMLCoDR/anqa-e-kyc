
const dev = {
    mattrStsAuthority: 'https://anqa-aml-zryywt.vii.mattr.global/ext/oidc/v1/verifiers/5252190d-175c-488a-8f04-7a41a212bd62',
    mattrClientId: '8cc1c1a8-bc88-4602-a8ac-2f792c723e49',
    mattrClientRoot: 'http://localhost:3000/',
    mattrClientScope: 'openid_credential_presentation',
    mattrIdentityDid: 'did:key:z6Mkur8imMAT5k1DiMUM4RigicQAJ3i55Suwa6L7q9rZQuL3',
};

const prd = {
    mattrStsAuthority: 'https://anqa-aml-zryywt.vii.mattr.global/ext/oidc/v1/verifiers/5252190d-175c-488a-8f04-7a41a212bd62',
    mattrClientId: '8cc1c1a8-bc88-4602-a8ac-2f792c723e49',
    mattrClientRoot: 'https://poc-stg.anqaml.com/',
    mattrClientScope: 'openid_credential_presentation',
    mattrIdentityDid: 'did:key:z6Mkur8imMAT5k1DiMUM4RigicQAJ3i55Suwa6L7q9rZQuL3',
};

const config = {
   // ...(process.env.REACT_APP_STAGE === "prd" ? prd : dev)
   ...(window.location.hostname === "localhost" ? dev : prd)
}

export default config;