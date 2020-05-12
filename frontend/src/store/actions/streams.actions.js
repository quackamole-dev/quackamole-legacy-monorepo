import {ADD_STREAM, CLEAR_ALL_STREAMS} from "../actionTypes";

export const addStream = (peerId, stream) => (dispatch, getState) => {
    if (stream) {
        dispatch({type: ADD_STREAM, payload: {peerId, stream}});
    }
};

export const startLocalStream = (peer, options = {video: true, audio: true}) => async (dispatch, getState) => {
    const localPeer = peer || getState().localUser.peer;
    try {
        let mediaStream = await navigator.mediaDevices.getUserMedia(options);
        dispatch(addStream(localPeer.id, mediaStream));
        window.localStream = mediaStream; // kind of hacky to stop the tracks on unmount
        return mediaStream;
    } catch (error) {
        console.error('local stream couldnt be started via "startStream()"', error);
    }
};
export const clearAllStreams = () => async (dispatch, getState) => {
        dispatch({type: CLEAR_ALL_STREAMS});

};
