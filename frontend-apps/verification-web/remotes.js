
// exports.remotes = (env) => {
module.exports = (stage = 'dev') => {

    const suffix = stage === 'prd' ? '' : '-stg';
    const hosts = {
        components: `https://components${suffix}.anqaml.com`,
        shell: `https://shell${suffix}.anqaml.com`,
    }

    // building for staging or production — only use components for that stage
    if (stage !== 'dev') {
        return hosts;
    }

    // we're building for dev — override with local references where needed
    // we can safely leave these "on" as these settings shouldn't leak 
    // into other environments
    return {
        ...hosts,
        // shell: "http://localhost:3001",
        // components: "http://localhost:3003",
    };
}
