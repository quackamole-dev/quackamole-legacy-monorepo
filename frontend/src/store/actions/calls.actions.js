import {ADD_CALL, REMOVE_CALL} from "../actionTypes";
import {addRemoteStream, addStream} from "./streams.actions";

export const addCall = call => (dispatch, getState) => {
    if (call) {
        dispatch({
            type: ADD_CALL,
            payload: {call}
        });

        dispatch(initCallListeners(call));
    }
};

export const removeCall = call => (dispatch, getState) => {
    if (call) {
        dispatch({
            type: REMOVE_CALL,
            payload: {call}
        });
    }
};

export const initCallListeners = call => (dispatch, getState) => {
    if (call) {
        call.on('stream', remoteMediaStream => {
            addRemoteStream(remoteMediaStream);  // TODO reference stream with remotePeer and store it in the streamMap outside redux
        });
    }
};
