import {ADD_STREAM, CLEAR_ALL_STREAMS, REMOVE_STREAM} from "../actionTypes";

export const addStream = (socketId, stream) => (dispatch, getState) => {
    if (stream) {
        dispatch({type: ADD_STREAM, payload: {socketId, stream}});
    }
};

export const removeStream = (socketId) => (dispatch, getState) => {
    if (socketId) {
        dispatch({type: REMOVE_STREAM, payload: {socketId}});
    }
};

export const startLocalStream = (socket, constraintsOverride) => async (dispatch, getState) => {
    const localSocket = socket || getState().localUser.socket;

    if (!socket) { return; }
    const socketId = socket.id;
    const localSteam = getState().streams.data[socketId];
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
            dispatch(addStream(localSocket.id, mediaStream));
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
