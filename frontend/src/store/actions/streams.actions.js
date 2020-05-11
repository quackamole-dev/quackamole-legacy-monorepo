import {SET_STREAM} from "../actionTypes";
import streamStore from "../streamStore";

export const setStream = (peerId, isActive) => (dispatch, getState) => {
    dispatch({
        type: SET_STREAM,
        payload: {peerId, isActive}
    });
};

export const startLocalStream = () => async (dispatch, getState) => {
    const localPeer = getState().localUser.peer;
     try {
         let mediaStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
         streamStore.setStream(localPeer.id, mediaStream);
         dispatch(setStream(localPeer.id, true));

         window.localStream = mediaStream;
     } catch (error) {
         console.error('local stream couldnt be started via "startStream()"', error);
     }
};

