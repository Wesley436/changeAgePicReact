import Webcam from "react-webcam";

import { useRef, useCallback, useContext } from "react";
import { ImageContext } from "../context/ImageContextProvider";
import { Button, Grid } from '@mui/material';
import { TextField } from "@mui/material";

import '../styles/App.css';

export default function WebcamCapture() {
    const {
        targetAge, setTargetAge,
        agedImage, setAgedImage,
    } = useContext(ImageContext);

    const webcamRef = useRef(null);
    const capture = useCallback(
        () => {
            console.log(targetAge);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'image': webcamRef.current.getScreenshot(),
                    "ageInfos":[
                        {
                            "Age": parseInt(targetAge)
                        }
                    ]
                })
            };
            console.log(requestOptions);
            fetch('https://dowe6z7odui3jytcofhbkhr4fq0vihxm.lambda-url.eu-west-2.on.aws/', requestOptions)
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    console.log(json);
                    setAgedImage(json.url);
                });
        },
        [webcamRef, targetAge, setAgedImage]
    );
    return (
        <div>
            <Grid>
                <Grid item lg={12}>
                    <Webcam audio={false} height={720} ref={webcamRef} screenshotFormat="image/jpeg" width={1280}/>
                </Grid>
                <Grid item lg={12}>
                    <TextField placeholder='Age?' onChange={(e) => {setTargetAge(e.target.value)}}/>
                </Grid>
                <Grid item lg={12}>
                    <Button variant="contained" onClick={capture}>Capture photo</Button>
                </Grid>
                <Grid item lg={12}>
                    <img src={agedImage}/>
                </Grid>
            </Grid>
            <image src="https://faceeffect-1254418846.cos.ap-guangzhou.myqcloud.com/ft/ChangeAgePic/1306607176/d55fbdcc-b188-4e49-bc12-a2ff74290bad"/>
        </div>
    );
}