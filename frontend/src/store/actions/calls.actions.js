import {ADD_CALL, REMOVE_CALL} from "../actionTypes";
import {setStream} from "./streams.actions";
import streamStore from "../streamStore";

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
            streamStore.setStream(call.peer, remoteMediaStream);
            dispatch(setStream(call.peer, true));
        });
    }
};
