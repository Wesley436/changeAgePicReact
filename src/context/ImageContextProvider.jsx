import { createContext, useState } from 'react';

export const ImageContext = createContext();

export default function ImageContextProvider(props) {
    const [beforeImage, setBeforeImage] = useState('');
    const [isLoading, setIsLoading] = useState('');
    const [afterImage, setAfterImage] = useState('');

    return (
        <ImageContext.Provider
            value={{
                beforeImage, setBeforeImage,
                isLoading, setIsLoading,
                afterImage, setAfterImage,
            }}
        >
            {props.children}
        </ImageContext.Provider>
    );
}