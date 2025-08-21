import React, { useState } from 'react';

import Camera, { IMAGE_TYPES } from 'react-html5-camera-photo';
import './css/camera.css';

import ImagePreview from './ImagePreview';

export const IdScan = (props) => {

    const [camerStarted, setCamerStarted] = useState(false);
  
    function handleTakePhotoAnimationDone(dataUri) {  
        props.onDocument(dataUri);
    }

    function handleCameraStart() {       
        setCamerStarted(true);
    }

    function PlaceholderImage() {
        return (
            (camerStarted)
                ?
                <img src={props.placeholderImg} className={props.placeholderCssClass} alt="" />
                : <></>
        );
    }

    const isFullscreen = false;

    return (
        <div>
            {
                (props.currentDocument )
                    ? <ImagePreview dataUri={props.currentDocument }
                        isFullscreen={isFullscreen}
                    />
                    :
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <PlaceholderImage />
                        <Camera
                            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                            onTakePhotoAnimationDone={handleTakePhotoAnimationDone}
                            isFullscreen={isFullscreen}
                            imageType={IMAGE_TYPES.JPG}
                            onCameraStart={handleCameraStart}
                            isMaxResolution={true}
                            isImageMirror={false}
                            imageCompression="1"
                        />
                    </div>
            }
        </div>
    );
};


export default IdScan;
