import {ADD_STREAM, CLEAR_ALL_STREAMS, REMOVE_STREAM} from '../actionTypes';

export const addStream = (socketId, stream) => (dispatch, getState) => { // TODO no need for a thunk, rename to setStream & SET_STREAM
  if (stream) {
    dispatch({ type: ADD_STREAM, payload: { socketId, stream } });
  }
};

export const removeStream = (socketId) => (dispatch, getState) => { // TODO no need for a thunk
  if (socketId) {
    dispatch({ type: REMOVE_STREAM, payload: { socketId } });
  }
};

export const clearAllStreams = () => async (dispatch, getState) => {
  dispatch({ type: CLEAR_ALL_STREAMS });
};

export const startLocalStream = (socket, constraintsOverride) => async (dispatch, getState) => {
  const localSocket = socket || getState().localUser.socket;

  if (!socket) {
    return;
  }
  const socketId = socket.id;
  const localSteam = getState().streams.data[socketId];
  if (!localSteam) {

    try {
      const constraints = {
        audio: true,
        // video: false
        video: {
          frameRate: { ideal: 20, max: 25 },
          width: { ideal: 128 },
          height: { ideal: 72 }
        }
      };

      let mediaStream = await navigator.mediaDevices.getUserMedia(constraintsOverride || constraints);
      dispatch(addStream(localSocket.id, mediaStream));
      return mediaStream;
    } catch (error) {
      console.error('local stream couldn\'t be started', error);
    }
  } else {
    console.log('local stream already active');
  }
};

export const toggleLocalAudio = () => (dispatch, getState) => {
  const socket = getState().localUser.socket;
  if (socket) {
    const localStreamWrapper = getState().streams.data[socket.id];
    if (localStreamWrapper) {
      const localStream = localStreamWrapper.stream;
      console.log('toggleLocalAudio');
      localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
      dispatch(addStream(socket.id, localStream));
    }
  }
};

export const toggleLocalVideo = () => (dispatch, getState) => {
  const socket = getState().localUser.socket;
  if (socket) {
    const localStreamWrapper = getState().streams.data[socket.id];
    if (localStreamWrapper) {
      const localStream = localStreamWrapper.stream;
      console.log('toggleLocalVideo');
      localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
      dispatch(addStream(socket.id, localStream));
    }
  }
};
