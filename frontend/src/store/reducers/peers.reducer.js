import {ADD_PEER, REMOVE_PEER, SET_PEERS_ERROR} from '../actionTypes';
import produce from 'immer';

const initialState = {
  data: {
    // 'd7f7saim3': {nickname: 'Andi'},
    // '32mfdnmio': {nickname: 'Jimmy'}
  },
  error: null
};

const peersReducer = produce((peersDraft, action) => {
  switch (action.type) {
    case ADD_PEER: {
      const { socketId, metadata } = action.payload;
      peersDraft.data[socketId] = { metadata };
      peersDraft.error = null;
      return;
    }
    case REMOVE_PEER: {
      const peer = action.payload.peer;
      delete peersDraft.data[peer.id];
      peersDraft.error = null;
      return;
    }
    case SET_PEERS_ERROR: {
      peersDraft.error = action.payload.error;
      return;

    }
    default: {}
  }
}, initialState);

export default peersReducer;
