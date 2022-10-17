import Webcam from "react-webcam";

import { useRef, useCallback, useContext, useState } from "react";
import { ImageContext } from "../context/ImageContextProvider";
import { Button, Grid } from '@mui/material';
import { TextField } from "@mui/material";

import '../styles/App.css';

const imageColumnStyle = {
    backgroundColor: '#EEE',
    borderRadius: '0.5rem',
}

const ageInputStyle = {
    margin: '1rem',
    width: '90%',
    '.MuiInputBase-root': {
        fontSize: '1rem',
        borderRadius: '1rem',
    },
}

const buttonStyle = {
    width: '90%',
    fontSize: '1rem',
    margin: '1rem',
    borderRadius: '1rem',
}

const imageStyle = {
    border: '0.1rem solid black',
    maxWidth: '80%',
    maxHeight:'80%',
}

export default function WebcamCapture() {
    const {
        capturedImage, setCapturedImage,
        targetAge, setTargetAge,
        agedImage, setAgedImage,
    } = useContext(ImageContext);

    const [changeButtonDisabled, setChangeButtonDisabled] = useState(false);

    const webcamRef = useRef(null);
    const capture = useCallback(
        () => {
            setChangeButtonDisabled(true);
            const image = webcamRef.current.getScreenshot({width: 1920, height: 1440});
            setCapturedImage(image);

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'image': image,
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
                    setChangeButtonDisabled(false);
                });
        },
        [webcamRef, targetAge, setAgedImage]
    );

    function handleAgeInput(e) {
        let input = e.target.value;
        input = input.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1').replace(/^0[^.]/, '0');
        let targetAge = parseInt(input);
        if(targetAge>100){
            targetAge=100;
        }
        if(targetAge<1){
            targetAge=1;
        }
        if(!targetAge){
            targetAge='';
        }
        setTargetAge(targetAge);
    }

    function printResultImage(){
        const iframe = document.createElement('iframe');
        iframe.style.height = 0;
        iframe.style.visibility = 'hidden';
        iframe.style.width = 0;

        iframe.setAttribute('srcdoc', '<html><body></body></html>');

        document.body.appendChild(iframe);
        iframe.onload =
        ()=>{
            const image = document.getElementById('agedImage').cloneNode();
            image.style.width = '100%';
            image.style.height = '100%';
            const body = iframe.contentDocument.body;
            body.style.textAlign = 'center';
            body.appendChild(image);
            console.log(iframe);
            setTimeout(function() {
                iframe.contentWindow.print();
            }, 1000);
        };
    }

    let isTargetAgeEmpty = !targetAge;

    return (
        <div style={{margin:'1rem'}}>
            <Grid container>
                <Grid item lg={10} sx={imageColumnStyle}>

                    <span>
                        <img id='agedImage' src={agedImage} style={imageStyle}/>
                    </span>
                    <span hidden={!capturedImage}>
                        <img src={capturedImage}  style={imageStyle}/>
                    </span>
                </Grid>
                <Grid item lg={2} sx={{height:'100%', padding:'1rem'}}>
                    <Webcam width='100%' screenshotQuality='1' audio={false} ref={webcamRef} screenshotFormat="image/jpeg"/>
                    <TextField sx={ageInputStyle} placeholder='Age' value={targetAge} onChange={(e) => {handleAgeInput(e)}}/>
                    <Button disabled={changeButtonDisabled||isTargetAgeEmpty} variant="contained" sx={buttonStyle} onClick={capture}>Change age</Button>
                    <Button disabled={!agedImage} variant="contained" sx={buttonStyle} onClick={printResultImage}>Print result</Button>
                    <Button disabled={!agedImage} variant="contained" sx={buttonStyle} onClick={() => {setCapturedImage('');setAgedImage('')}}>Reset</Button>
                </Grid>
            </Grid>
        </div>
    );
}