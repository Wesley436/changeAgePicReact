import { createContext, useState } from 'react';

export const ImageContext = createContext();

export default function ImageContextProvider(props) {
    const [capturedImage, setCapturedImage] = useState('');
    const [isLoading, setIsLoading] = useState('');
    const [agedImage, setAgedImage] = useState('');
    const [printImage, setPrintImage] = useState('');

    return (
        <ImageContext.Provider
            value={{
                capturedImage, setCapturedImage,
                isLoading, setIsLoading,
                agedImage, setAgedImage,
            }}
        >
            {props.children}
        </ImageContext.Provider>
    );
}