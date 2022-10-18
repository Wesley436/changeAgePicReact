import Webcam from "react-webcam";

import { useRef, useCallback, useContext, useState } from "react";
import { ImageContext } from "../context/ImageContextProvider";
import { Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import banner from "../images/banner.png";

import '../styles/App.css';

const imageColumnStyle = {
    padding: '1rem',
}

const labelStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    display: 'flex',
    paddingLeft: '2rem',
}

const imageStyle = {
    maxWidth: '95%',
    maxHeight:'95%',
    padding: '1rem',
}

export default function WebcamCapture() {
    const {
        capturedImage, setCapturedImage,
        isLoading, setIsLoading,
        agedImage, setAgedImage,
    } = useContext(ImageContext);

    const webcamRef = useRef(null);
    const capture = useCallback(
        () => {
            if(isLoading){
                return;
            }
            setIsLoading(true);

            const image = webcamRef.current.getScreenshot({width: 1920, height: 1440});
            setCapturedImage(image);

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'image': image,
                    "ageInfos":[
                        {
                            "Age": 70
                        }
                    ]
                })
            };

            console.log(requestOptions);

            fetch('https://dowe6z7odui3jytcofhbkhr4fq0vihxm.lambda-url.eu-west-2.on.aws/', requestOptions)
                .then(response => {
                    console.log(response);
                    return response.json();
                })
                .then(json => {
                    if(json){
                        console.log(json);
                        if(json.url){
                            setAgedImage(json.url);
                        }
                    }
                    setIsLoading(false);
                });
        },
        [webcamRef, setAgedImage, setCapturedImage, isLoading, setIsLoading]
    );

    return (
        <div style={{}}>
            <Grid container>
                <Grid item lg={12}>
                    <img src={banner} onClick={capture}/>
                </Grid>
                <Grid item lg={12} sx={imageColumnStyle}>
                    <span hidden={!isLoading}>
                        <LoadingButton loading={true} sx={{width: '95%', height: '95%', scale: '5'}}/>
                    </span>
                    <div hidden={!agedImage || isLoading}>
                        <div>
                            <label style={labelStyle}>After:</label>
                        </div>
                        <span>
                            <img src={agedImage} style={imageStyle} onClick={() => {setCapturedImage('');setAgedImage('')}}/>
                        </span>
                    </div>
                    <span>
                        <div>
                            <label style={labelStyle}>Before:</label>
                        </div>
                        <img hidden={!capturedImage} src={capturedImage}  style={imageStyle} onClick={() => {setCapturedImage('');setAgedImage('')}}/>
                        <Webcam hidden={capturedImage} width='100%' screenshotQuality='1' audio={false} ref={webcamRef} screenshotFormat="image/jpeg"/>
                    </span>
                </Grid>
            </Grid>
        </div>
    );
}