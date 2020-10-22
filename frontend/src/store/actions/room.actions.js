import {SET_CURRENT_ROOM, SET_CURRENT_ROOM_ERROR} from '../actionTypes';
import {clearAllStreams} from './streams.actions';
import {resetLocalUser} from './localUser.actions';

export const setCurrentRoom = room => ({
  type: SET_CURRENT_ROOM,
  payload: { room }
});

export const setCurrentRoomError = error => ({
  type: SET_CURRENT_ROOM_ERROR,
  payload: { error }
});

export const roomExitCleanup = () => (dispatch, getState) => {
  const state = getState();

  const socket = state.localUser.socket;
  if (socket) {
    // disconnect from socketIO server
    const currentRoom = state.room.data;
    if (currentRoom.id) {
      socket.emit('leave', currentRoom.id);
      dispatch(setCurrentRoom({}));
    }
    socket.disconnect();
    dispatch(resetLocalUser());

    // clear local media stream
    const localStreamWrapper = state.localUser.mediaStream;
    if (localStreamWrapper) {
      localStreamWrapper.stream.getTracks().forEach(track => track.stop());
    }
    dispatch(clearAllStreams());
  }

  // close all RTCPeerConnections
  const connections = state.connections.data;
  if (connections) {
    Object.values(connections).forEach(conn => conn.close());
  }
};
