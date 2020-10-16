import {INIT_LOCAL_USER_SOCKET, RESET_LOCAL_USER, SET_LOCAL_USER_ERROR, SET_LOCAL_USER_LOADING, SET_LOCAL_USER_METADATA} from '../actionTypes';
import {getPersistedData} from '../../utils';
import produce from 'immer';

const initialState = {
  socket: null,
  metadata: getPersistedData('metadata'),
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
    case SET_LOCAL_USER_ERROR: {
      localPeerDraft.error = action.payload.error;
      return;
    }
    case RESET_LOCAL_USER: {
      localPeerDraft.socket = null;
      localPeerDraft.loading = false;
      localPeerDraft.metadata = getPersistedData('metadata');
      localPeerDraft.error = null;
      return;
    }
    default: {}
  }
}, initialState);

export default localUserReducer;
