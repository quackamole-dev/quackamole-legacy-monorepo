// The place to put all helper methods that do not necessarily belong to a specific component
// Once this file gets too crowded, create an utils folder and start seperating the exported helper methods

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
