import {addStream} from './remoteStreams.actions';
import {clearStreamTracks} from '../../utils';
import {SET_LOCAL_USER_CAMERA_ENABLED, SET_LOCAL_USER_MEDIA_CONSTRAINTS, SET_LOCAL_USER_MEDIA_STREAM, SET_LOCAL_USER_MICROPHONE_ENABLED} from '../actionTypes';
import {updateStreamForConnections} from './connections.actions';

export const startLocalStream = () => async (dispatch, getState) => {
  console.log('startLocalStream dispatched');
  const { mediaConstraints, micEnabled, camEnabled } = getState().localUser;

  if (!micEnabled && !camEnabled) {
    dispatch(stopLocalStream());
    return;
  }

  const actualConstraints = { ...mediaConstraints };
  actualConstraints.audio = micEnabled ? actualConstraints.audio : false;
  actualConstraints.video = camEnabled ? actualConstraints.video : false;

  try {
    const newStream = await navigator.mediaDevices.getUserMedia(actualConstraints);
    await dispatch(updateStreamForConnections(newStream));
    await dispatch({ type: SET_LOCAL_USER_MEDIA_STREAM, payload: { mediaStream: { stream: newStream } } });
    return newStream;
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
      localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
      dispatch(addStream(socket.id, localStream));
    }
  }
};

export const setMediaStreamConstraints = (constraints) => async (dispatch, getState) => {
  await dispatch({ type: SET_LOCAL_USER_MEDIA_CONSTRAINTS, payload: { constraints } });

  // Re-Start local stream to update constraints
  const localStreamWrapper = getState().localUser.mediaStream;
  if (localStreamWrapper) {
    dispatch(startLocalStream());
  }
};

export const toggleMicrophoneEnabled = () => (dispatch, getState) => {
  const newEnabled = !getState().localUser.micEnabled;
  dispatch({ type: SET_LOCAL_USER_MICROPHONE_ENABLED, payload: { enabled: newEnabled } });

  // Re-Start local stream to update constraints
  const localStreamWrapper = getState().localUser.mediaStream;
  if (localStreamWrapper || newEnabled) {
    dispatch(startLocalStream());
  }
};

export const toggleCameraEnabled = () => (dispatch, getState) => {
  const newEnabled = !getState().localUser.camEnabled;
  dispatch({ type: SET_LOCAL_USER_CAMERA_ENABLED, payload: { enabled: newEnabled } });

  // Re-Start local stream to update constraints
  const localStreamWrapper = getState().localUser.mediaStream;
  if (localStreamWrapper || newEnabled) {
    dispatch(startLocalStream());
  }
};
