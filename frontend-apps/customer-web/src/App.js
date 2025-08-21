import React, { lazy, Suspense } from "react";

const Shell = lazy(() => import("shell/Shell"));

const App = () => {
    return (
        <Suspense fallback={"Loading shell..."}>
            <Shell />
        </Suspense>
    );
};

export default App;
