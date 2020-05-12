// The place to put all helper methods that do not necessarily belong to a specific component
// Once this file gets too crowded, create an utils folder and start seperating the exported helper methods

import {useEffect, useRef, useState} from "react";

/**
 * Transforms a javascript object into a query string.
 * @param object The source object. Example: {a: 5, b: 10}
 * @returns {string} The resulting query string. Example 'a=5&b=10'
 */
export const serializeQueryString = object => {
    return Object.entries(object).map(([key, value]) => `${key}=${value}`).join('&');
};

/**
 * Set the src of a html5 <video> element and start playing
 * @param videoRef The reference to the video element
 * @param stream The stream that should be played by the referenced video element
 * @param muted Whether or not the audio of the stream should be muted
 */
export const setVideoSrc = (videoRef, stream, muted= true) => {
    if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.oncanplay = () => {
            videoRef.current.play();
            videoRef.current.muted = muted;
        };
    }
};

// untested prototype for a hook that might replace setVideoSrc(). Right now there is no benefit of using it. Rethink design
export const useStream = (muted = false) => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.oncanplay = () => {
                videoRef.current.play();
                videoRef.current.muted = muted;
            };
        }
    }, [stream, videoRef, muted]);

    return [videoRef, setStream];
};

export const clearStreamTracks = stream => {
    if (stream) {
        console.log('clear tracks', stream);
        stream.getTracks().forEach(track => track.stop());
    }
};

