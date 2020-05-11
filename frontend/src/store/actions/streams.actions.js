import {ADD_LOCAL_STREAM, ADD_REMOTE_STREAM, REMOVE_REMOTE_STREAM} from "../actionTypes";

export const addLocalStream = stream => (dispatch, getState) => {
    if (stream) {
        // TODO store the stream blob in some sort of hashmap, reference the id in redux
        dispatch({
            type: ADD_LOCAL_STREAM,
            payload: {stream}
        });
    }
};

export const addRemoteStream = stream => (dispatch, getState) => {
    if (stream) {
        // TODO store the stream blob in some sort of hashmap, reference the id in redux
        dispatch({
            type: ADD_REMOTE_STREAM,
            payload: {stream}
        });
    }
};

export const removeStream = stream => (dispatch, getState) => {
    if (stream) {
        dispatch({
            type: REMOVE_REMOTE_STREAM,
            payload: {stream}
        });
    }
};
