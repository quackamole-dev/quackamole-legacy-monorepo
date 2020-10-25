import {SET_CURRENT_ROOM, SET_CURRENT_ROOM_ERROR, SET_VISITED_LOBBY} from '../actionTypes';
import produce from 'immer';

const initialState = {
  data: {
    // id: 'dummy-room-id',
    // name: 'Dummy Room',
  },
  visitedLobby: false,
  error: null
};

const roomReducer = produce((roomDraft, action) => {
  switch (action.type) {
    case SET_CURRENT_ROOM: {
      roomDraft.data = action.payload.room;
      roomDraft.error = null;
      return;
    }
    case SET_VISITED_LOBBY: {
      roomDraft.visitedLobby = action.payload.visitedLobby;
      return;
    }
    case SET_CURRENT_ROOM_ERROR: {
      roomDraft.error = action.payload.error;
      return;
    }
    default: {}
  }
}, initialState);

export default roomReducer;
