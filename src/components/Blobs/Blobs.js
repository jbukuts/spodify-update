import React,{ useEffect, useRef, useState } from 'react';
import { createPalette } from '../../common/palette';
import './Blobs.css'

const Blobs = ({imageURL}) => {
    const [palette, setPalette] = useState();
    const blobsRef = useRef();

    const colorString = (rgbArray) => {
        return `rgb(${rgbArray[0]},${rgbArray[1]},${rgbArray[2]})`;
    }

    //The maximum is exclusive and the minimum is inclusive
    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    const buildPalette = () => {
        createPalette(imageURL, 10, 16).then(r => {
            const bgColor = colorString(r.shift());
            r = r
                .sort(() => (Math.random() > .5) ? 1 : -1)
                .slice(0,4)
                .map(cArr => colorString(cArr));
            setPalette(() => [bgColor, ...r]);
        });
    }

    useEffect(() => {
        buildPalette(imageURL);

        const moveInterval = setInterval(() => {
            const min = 0;
            const max = 1000000;
            [...blobsRef.current.children].forEach(blob => {
                blob.style.borderTopLeftRadius = `${getRandomInt(min, max)}px ${getRandomInt(min, max)}px`;
                blob.style.borderTopRightRadius = `${getRandomInt(min, max)}px ${getRandomInt(min, max)}px`;
                blob.style.borderBottomLeftRadius = `${getRandomInt(min, max)}px ${getRandomInt(min, max)}px`;
                blob.style.borderBottomRightRadius = `${getRandomInt(min, max)}px ${getRandomInt(min, max)}px`;
            });
        }, 500);

        return () => clearInterval(moveInterval);
    }, []);

    useEffect(() => {
        buildPalette(imageURL);
    }, [imageURL]);

    return (<>{ palette && 
        <>
            <div className='coverBlur'></div>
            <div className='blobs' ref={blobsRef} style={{backgroundColor: palette[0]}}>
                <div className="blob" style={{background: palette[1]}}></div>
                <div className="blob bottomRight" style={{background: palette[2]}}></div>
                <div className="blob topRight" style={{background: palette[3]}}></div>
                <div className="blob bottomLeft" style={{background: palette[4]}}></div>
            </div>

        </>
    }</>);
}

export default Blobs;