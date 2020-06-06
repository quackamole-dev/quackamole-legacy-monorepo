import {ADD_CALL, REMOVE_CALL} from "../actionTypes";
import {startLocalStream, addStream} from "./streams.actions";

export const addCall = call => (dispatch, getState) => {
    if (call) {
        dispatch({type: ADD_CALL, payload: {call}});
        dispatch(initCallListeners(call));
    }
};

export const removeCall = call => (dispatch, getState) => {
    if (call) {
        dispatch({type: REMOVE_CALL, payload: {call}});
    }
};

export const initCallListeners = call => (dispatch, getState) => {
    if (call) {
        call.on('stream', remoteMediaStream => {
            dispatch(addStream(call.peer, remoteMediaStream));
        });
    }
};

export const callConnection = connection => async (dispatch, getState) => {
    const {peer} = getState().localUser;
    const localStream = getState().streams.data[peer.id] || await dispatch(startLocalStream(peer));

    const call = await peer.call(connection.peer, localStream);
    dispatch(addCall(call));
};

export const callReplaceStreamTrack = (remotePeerId, options) => async (dispatch, getState) => {
    const call = getState().calls.data[remotePeerId];
    const {peer} = getState().localUser;
    const localStream = await dispatch(startLocalStream(peer, options));

    call.peerConnection.getSenders()[0].replaceTrack(localStream);

    dispatch(addCall(call));
};
