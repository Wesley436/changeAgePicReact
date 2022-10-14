import { createContext, useState } from 'react';

export const ImageContext = createContext();

export default function ImageContextProvider(props) {
    const [capturedImage, setCapturedImage] = useState('');
    const [targetAge, setTargetAge] = useState('');
    const [agedImage, setAgedImage] = useState('');

    return (
        <ImageContext.Provider
            value={{
                capturedImage, setCapturedImage,
                targetAge, setTargetAge,
                agedImage, setAgedImage,
            }}
        >
            {props.children}
        </ImageContext.Provider>
    );
}