import React from 'react';

import { useParams } from 'react-router-dom';

import { useView } from '../../api';
// import { useAlerter } from '../../components/AlertProvider';
import { WaitSkeleton } from '../../components/WaitSkeleton';
import { NotFound } from './NotFound';
import { Renderer } from './Renderer';
// import { Tracker } from './Tracker';



const Content = () => {
    // const { showAlert } = useAlerter();
    var { type, slug } = useParams();
    [type, slug] = [type || "assembly", slug || "home"];
    const { content, error } = useView(type, slug);

    if (error && error.status === 404) {
        // showAlert(error.msg) 
        return (<NotFound />)
    } else {
        return (
            <>
                {content
                    ? <Renderer content={content} />
                    : <WaitSkeleton variant="default" />
                }
            </>
        )
    }
}

export default Content;

Content.propTypes = {};
Content.defaultProps = {};