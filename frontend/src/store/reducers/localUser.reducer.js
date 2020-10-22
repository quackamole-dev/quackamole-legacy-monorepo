import {INIT_LOCAL_USER_SOCKET, RESET_LOCAL_USER, SET_LOCAL_USER_ERROR, SET_LOCAL_USER_LOADING, SET_LOCAL_USER_METADATA, SET_LOCAL_USER_MEDIA_STREAM, SET_LOCAL_USER_MEDIA_CONSTRAINTS, SET_LOCAL_USER_CAMERA_ENABLED, SET_LOCAL_USER_MICROPHONE_ENABLED} from '../actionTypes';
import {clearStreamTracks, getPersistedData} from '../../utils';
import produce from 'immer';

const defaultMediaConstraints = {
  audio: {},
  video: {
    frameRate: { ideal: 20, max: 25 },
    width: { ideal: 128 },
    height: { ideal: 72 }
  }
};

const initialState = {
  socket: null,
  metadata: getPersistedData('metadata'),
  mediaConstraints: defaultMediaConstraints,
  mediaStream: null,
  micEnabled: true,
  camEnabled: true,
  loading: false,
  error: null
};

const localUserReducer = produce((localPeerDraft, action) => {
  switch (action.type) {
    case SET_LOCAL_USER_LOADING: {
      localPeerDraft.loading = action.payload.loading;
      return;
    }
    case INIT_LOCAL_USER_SOCKET: {
      localPeerDraft.socket = action.payload.socket;
      localPeerDraft.error = null;
      return;
    }
    case SET_LOCAL_USER_METADATA: {
      localPeerDraft.metadata = action.payload.metadata;
      localPeerDraft.error = null;
      return;
    }
    case SET_LOCAL_USER_MEDIA_STREAM: {
      const oldMediaStream = localPeerDraft.mediaStream;

      localPeerDraft.mediaStream = action.payload.mediaStream;
      localPeerDraft.error = null;

      // Cleanup old stream. Without this, webcam light can stay on unintentionally due to unreliable garbage collection
      if (oldMediaStream) {
        if (action.payload.mediaStream && action.payload.mediaStream.stream.id !== oldMediaStream.stream.id) {
          clearStreamTracks(oldMediaStream.stream);
        } else if (!action.payload.mediaStream) {
          clearStreamTracks(oldMediaStream.stream);
        }
      }

      return;
    }
    case SET_LOCAL_USER_MEDIA_CONSTRAINTS: {
      localPeerDraft.mediaConstraints = action.payload.constraints;
      localPeerDraft.error = null;
      return;
    }
    case SET_LOCAL_USER_MICROPHONE_ENABLED: {
      localPeerDraft.micEnabled = action.payload.enabled;
      localPeerDraft.error = null;
      return;
    }
    case SET_LOCAL_USER_CAMERA_ENABLED: {
      localPeerDraft.camEnabled = action.payload.enabled;
      localPeerDraft.error = null;
      return;
    }
    case SET_LOCAL_USER_ERROR: {
      localPeerDraft.error = action.payload.error;
      return;
    }
    case RESET_LOCAL_USER: {
      localPeerDraft.socket = null;
      localPeerDraft.metadata = getPersistedData('metadata');
      localPeerDraft.mediaConstraints = defaultMediaConstraints;
      localPeerDraft.mediaStream = null;
      localPeerDraft.micEnabled = true;
      localPeerDraft.camEnabled = true;
      localPeerDraft.loading = false;
      localPeerDraft.error = null;
      return;
    }
    default: {}
  }
}, initialState);

export default localUserReducer;
