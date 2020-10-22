import {ADD_STREAM, CLEAR_ALL_STREAMS, REMOVE_STREAM, SET_LOCAL_USER_MEDIA_STREAM} from '../actionTypes';
import {clearStreamTracks} from '../../utils';

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

export const startLocalStream = () => async (dispatch, getState) => { // TODO move to localUser.actions and rename streamsReducer to remoteStreams.reducer
  const { mediaConstraints, micEnabled, camEnabled } = getState().localUser;

  if (!micEnabled && !camEnabled) {
    dispatch(stopLocalStream());
    return;
  }

  const actualConstraints = { ...mediaConstraints };
  actualConstraints.audio = micEnabled ? actualConstraints.audio : false;
  actualConstraints.video = camEnabled ? actualConstraints.video : false;

  try {
    const stream = await navigator.mediaDevices.getUserMedia(actualConstraints);
    dispatch({ type: SET_LOCAL_USER_MEDIA_STREAM, payload: { mediaStream: { stream } } });
    return stream;
  } catch (error) {
    console.error('local stream couldn\'t be started', error);
  }
};

export const stopLocalStream = () => async (dispatch, getState) => {
  const { mediaStream } = getState().localUser;

  if (mediaStream) {
    clearStreamTracks(mediaStream.stream);
    dispatch({ type: SET_LOCAL_USER_MEDIA_STREAM, payload: { mediaStream: false } });
  }
};

export const toggleLocalAudio = () => (dispatch, getState) => {
  const socket = getState().localUser.socket;
  if (socket) {
    const localStreamWrapper = getState().localUser.mediaStream;
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
    const localStreamWrapper = getState().localUser.mediaStream;
    if (localStreamWrapper) {
      const localStream = localStreamWrapper.stream;
      console.log('toggleLocalVideo');
      localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
      dispatch(addStream(socket.id, localStream));
    }
  }
};
