import React, { useCallback, useEffect, useRef, useState } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Skeleton from '@material-ui/core/Skeleton';
import Typography from '@material-ui/core/Typography';
import VideoCameraFrontIcon from '@material-ui/icons/VideoCameraFront';
import * as faceapi from 'face-api.js'

const mtcnnOptions = new faceapi.MtcnnOptions({
    // number of scaled versions of the input image passed through the CNN
    // of the first stage, lower numbers will result in lower inference time,
    // but will also be less accurate
    maxNumScales: 10,
    // to calculate image pyramid scale steps for stage 1
    scaleFactor: 0.709,
    // threshold values used to filter the bounding boxes of stage 1, 2 and 3
    scoreThresholds: [0.6, 0.7, 0.7],
    // higher numbers = faster processing, but smaller faces won't be detected
    minFaceSize: 200
})

export const Liveness = () => {
    const [loading, setLoading] = useState(true);

    const streamRef = useRef({ stream: null });
    const videoRef = useRef();
    const canvasRef = useRef();

    const startCam = useCallback(async () => {
        setLoading(true);

        // await faceapi.loadSsdMobilenetv1Model('/models');
        // await faceapi.loadFaceDetectionModel('/models');
        // await faceapi.loadTinyFaceDetectorModel('/models');
        await faceapi.loadFaceRecognitionModel('/models');
        await faceapi.loadFaceLandmarkModel('/models');
        await faceapi.loadMtcnnModel('/models');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current.stream = stream;
            videoRef.current.srcObject = stream;
        } catch (err) {
            console.log(err);
        }
    }, [videoRef]);

    const stopCam = useCallback(() => {
        if (streamRef.current === null) {
            return;
        }
        const stream = streamRef.current.stream;
        stream.getTracks().forEach(function (track) {
            track.stop();
        });
    }, []);


    useEffect(() => {
        startCam();

        return (() => {
            // stopCam();
        });
    }, [startCam, stopCam]);

    async function onPlay() {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video === null) {
            return;
        }

        const cw = video.videoWidth;
        const ch = video.videoHeight;
        canvas.width = cw;
        canvas.height = ch;

        // draw video to canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, cw, ch);

        // draw face detection overlay to canvas
        // see https://github.com/justadudewhohacks/face-api.js

        const faces = await faceapi.detectAllFaces(video, mtcnnOptions).withFaceLandmarks();//.withFaceDescriptors();
        faceapi.draw.drawDetections(canvas, faces);

        // // determine if nose is positioned in box 
        // if (faces.length > 0 && faces[0].landmarks) {
        //     const nose = faces[0].landmarks.getNose();
        //     console.log(nose);
        // }

        // repeat every 100ms
        setTimeout(() => onPlay(), 100)
        setLoading(false);
    }

    return (
        <>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video onPlay={() => onPlay()} autoPlay={true} ref={videoRef} style={{ display: 'none' }} />

            <Card sx={{ width: '100%' }}>
                <CardHeader
                    avatar={
                        loading
                            ? <Skeleton animation="wave" variant="circular" width={40} height={40} />
                            : <Avatar alt="Video camera">
                                <VideoCameraFrontIcon />
                            </Avatar>
                    }
                    title={
                        loading
                            ? <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />
                            : 'Liveness Test'
                    }
                    subheader={
                        loading
                            ? <Skeleton animation="wave" height={10} width="40%" />
                            : 'This test performs 3 checks to confirm you are a human'
                    }
                />


                <CardMedia title="Scan ID">
                    {loading &&
                        < Skeleton animation="wave" variant="rectangular" width="100%" sx={{ height: 300 }} />
                    }
                    <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: loading ? 'none' : 'block' }} />
                </CardMedia>

                <CardContent>
                    {loading ? (
                        <>
                            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                            <Skeleton animation="wave" height={10} width="80%" />
                        </>
                    ) : (
                        <Typography variant="body2" color="text.secondary" component="p">
                            {"Keeping your face in the outline, move your nose to the yellow dot"}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

export default Liveness;
