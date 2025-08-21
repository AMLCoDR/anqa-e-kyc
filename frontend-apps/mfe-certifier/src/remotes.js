import React, { lazy, Suspense, useEffect, useState } from "react";
// import { useTracker } from 'shell/Instana';

// TODO: Turn this into an npm package

const MFE = props => {
    const { mfe, componentProps } = props;
    const url = props.mfe && props.mfe.url;
    const { ready, failed } = useDynamicScript({ url: mfe && mfe.url });
    // const { error } = useTracker();

    if (!props.mfe) {
        console.warn('Micro front end not specified. Set mfe prop on MFE component');
    }

    if (!url) {
        return <Loading msg="Configuring" />;
    }
    if (!ready) {
        return <Loading msg={`Creating script for ${mfe.scope} component ${mfe.module} from ${mfe.url}`} />;
    }
    if (failed) {
        return <Loading msg={`Failed to load ${mfe.scope} component ${mfe.module} from ${mfe.url}`} />
    }

    const Component = lazy(loadComponent(mfe.scope, mfe.module));

    return (
        <Suspense fallback={<Loading />}>
            <Component props={componentProps}>
                {props.children}
            </Component>
        </Suspense>
    )
};

export default MFE;

const Loading = ({ msg }) => {
    console.log(`Loading... ${msg || ''}`);
    // TODO: Do not show progress text to user. Replace with a spinner. Can use Material UI if necessary but cannot use
    // theme as it won't be loaded yet.
    return <div>Loading... {msg}</div>;
};

// TODO: Inject config rather than hard code it. Options include JSON file (probably best for now) or endpoint.
export const useRemote = (scope, module) => {
    const [remote, setRemote] = useState(undefined);

    useEffect(() => {
        const suffix = process.env.REACT_APP_STAGE === 'prd' ? '' : '-stg';

        const remotes = {
            shell: `https://go-shell${suffix}.anqaml.com`,
        };

        if (scope && remotes[scope]) {
            setRemote({
                scope: scope,
                url: `${remotes[scope]}/remoteEntry.js`,
                module: module,
            });
        }
    }, [scope, module]);

    return { ...remote };
};

export const loadComponent = (scope, module) => {
    return async () => {
        // Initialise the shared scope.
        // Fill with known modules from this build and all (webpack) configured remotes
        // eslint-disable-next-line no-undef
        await __webpack_init_sharing__('default');
        const container = window[scope];
        // eslint-disable-next-line no-undef
        await container.init(__webpack_share_scopes__.default);
        const factory = await window[scope].get(module);
        const Module = factory();
        return Module;
    };
}

export const useDynamicScript = args => {
    const [ready, setReady] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (!args.url) {
            return;
        }

        const el = document.createElement("script");
        el.src = args.url;
        el.type = "text/javascript";
        el.async = true;

        setReady(false);
        setFailed(false);

        el.onload = () => {
            console.log(`Dynamic script loaded: ${args.url}`);
            setReady(true);
        };

        el.onerror = () => {
            error(`Dynamic script error: ${args.url}`);
            console.error(`Dynamic script error: ${args.url}`);
            setReady(false);
            setFailed(true);
        };

        document.head.appendChild(el);

        return () => {
            console.log(`Dynamic script removed: ${args.url}`);
            document.head.removeChild(el);
        };

    }, [args.url]);

    return { ready, failed };
};
