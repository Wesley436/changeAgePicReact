import Webcam from "react-webcam";

import { useRef, useCallback, useContext } from "react";
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
        beforeImage, setBeforeImage,
        isLoading, setIsLoading,
        afterImage, setAfterImage,
    } = useContext(ImageContext);

    const webcamRef = useRef(null);
    const capture = useCallback(
        () => {
            if(isLoading){
                return;
            }
            if(afterImage){
                setBeforeImage('');
                setAfterImage('');
                return;
            }
            setIsLoading(true);

            const image = webcamRef.current.getScreenshot({width: 1920, height: 1440});
            setBeforeImage(image);

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
                            setAfterImage(json.url);
                        }
                    }else{
                        setBeforeImage('');
                    }
                    setIsLoading(false);
                });
        },
        [webcamRef, setBeforeImage, isLoading, setIsLoading, afterImage, setAfterImage,]
    );

    return (
        <div style={{}}>
            <Grid container>
                <Grid item lg={12}>
                    <img alt={'banner'} src={banner} onClick={capture} style={{width:'100%'}}/>
                </Grid>
                <Grid item lg={12} sx={imageColumnStyle}>
                    <span hidden={!isLoading}>
                        <LoadingButton loading={true} sx={{width: '95%', height: '95%', scale: '10'}}/>
                    </span>
                    <div hidden={!afterImage || isLoading}>
                        <div>
                            <label style={labelStyle}>{'After (後):'}</label>
                        </div>
                        <span>
                            <img src={afterImage} alt={'after'} style={imageStyle} onClick={() => {setBeforeImage('');setAfterImage('')}}/>
                        </span>
                    </div>
                    <span>
                        <div>
                            <label style={labelStyle}>{'Before (前):'}</label>
                        </div>
                        <img hidden={!beforeImage} alt={'before'} src={beforeImage}  style={imageStyle} onClick={() => {setBeforeImage('');setAfterImage('')}}/>
                        <Webcam hidden={beforeImage} width='100%' screenshotQuality='1' audio={false} ref={webcamRef} screenshotFormat="image/jpeg"/>
                    </span>
                </Grid>
            </Grid>
        </div>
    );
}