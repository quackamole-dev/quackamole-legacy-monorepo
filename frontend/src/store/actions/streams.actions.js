import {ADD_STREAM, CLEAR_ALL_STREAMS, REMOVE_STREAM} from "../actionTypes";

export const addStream = (peerId, stream) => (dispatch, getState) => {
    if (stream) {
        dispatch({type: ADD_STREAM, payload: {peerId, stream}});
    }
};

export const removeStream = (peerId) => (dispatch, getState) => {
    if (peerId) {
        dispatch({type: REMOVE_STREAM, payload: {peerId}});
    }
};

export const startLocalStream = (peer, constraintsOverride) => async (dispatch, getState) => {
    const localPeer = peer || getState().localUser.peer;
    const localSteam = getState().streams.data[localPeer.id]
    if (!localSteam) {

        try {
            const constraints = {
                audio: true,
                video: {
                    frameRate: {ideal: 20, max: 25},
                    width: {ideal: 128},
                    height: {ideal: 72}
                }
            };

            let mediaStream = await navigator.mediaDevices.getUserMedia(constraintsOverride || constraints);
            dispatch(addStream(localPeer.id, mediaStream));
            window.localStream = mediaStream; // kind of hacky to stop the tracks on unmount
            return mediaStream;
        } catch (error) {
            console.error('local stream couldnt be started', error);
        }
    } else {
        console.log('local stream already active');
    }
};
export const clearAllStreams = () => async (dispatch, getState) => {
        dispatch({type: CLEAR_ALL_STREAMS});

};
