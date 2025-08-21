import React, { useCallback, useState, useEffect, useRef } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Skeleton from '@material-ui/core/Skeleton';
import Typography from '@material-ui/core/Typography';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import VideoCameraFrontIcon from '@material-ui/icons/VideoCameraFront';


export const ScanId = () => {
    const [loading, setLoading] = useState(true);
    const [scanned, setScanned] = useState(false);

    const streamRef = useRef({ stream: null });
    const videoRef = useRef();
    const canvasRef = useRef();

    const startCam = useCallback(async () => {
        setLoading(true);
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
            stopCam();
        });
    }, [startCam, stopCam]);

    const handleScanId = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        const cw = video.videoWidth;
        const ch = video.videoHeight;
        canvas.width = cw;
        canvas.height = ch;

        // draw captured video frame to canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, cw, ch);

        stopCam();
        setScanned(true);
    }

    const handleTryAgain = async () => {
        setScanned(false);
        startCam();
    }

    const handlePlay = async () => {
        setLoading(false);
    }

    return (
        <Card sx={{ width: '100%' }}>
            <CardHeader
                avatar={
                    loading
                        ? <Skeleton animation="wave" variant="circular" width={40} height={40} />
                        : <Avatar alt="Video camera">
                            <VideoCameraFrontIcon />
                        </Avatar>
                }
                action={
                    <Button onClick={scanned ? handleTryAgain : handleScanId}
                        startIcon={<PhotoCameraIcon/>} color="secondary" variant="contained"
                    >
                        {scanned ? 'Try again' : 'Scan ID'}
                    </Button>
                }
                title={
                    loading
                        ? <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />
                        : 'Scan ID'
                }
                subheader={
                    loading
                        ? <Skeleton animation="wave" height={10} width="40%" />
                        : 'Scan your ID to verify your identity'
                }
            />
            {loading &&
                <Skeleton animation="wave" variant="rectangular" width="100%" sx={{ height: 300 }} />
            }

            <CardMedia title="Scan ID">
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: scanned ? 'block' : 'none' }} />
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video onPlay={() => handlePlay()} autoPlay={true} ref={videoRef} style={{ width: '100%', height: '100%', display: loading ? 'none' : scanned ? 'none' : 'block' }}></video>
            </CardMedia>

            <CardContent>
                {loading ? (
                    <>
                        <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                        <Skeleton animation="wave" height={10} width="80%" />
                    </>
                ) : (
                    <Typography variant="body2" color="text.secondary" component="p">
                        {scanned
                            ? "Click the Verify button to use the scanned image. Click 'Try Again' to rescan your ID."
                            : "Hold your selected ID (passport, drivers licence, etc.) up to the camera and click the Scan ID button."
                        }
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

export default ScanId;
