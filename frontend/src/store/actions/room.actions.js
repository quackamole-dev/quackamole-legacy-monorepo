import {SET_CURRENT_ROOM, SET_CURRENT_ROOM_ERROR} from "../actionTypes";
import {clearAllStreams} from './streams.actions';
import {resetLocalUser} from './localUser.actions';

export const setCurrentRoom = room => ({
    type: SET_CURRENT_ROOM,
    payload: {room}
});

export const setCurrentRoomError = error => ({
    type: SET_CURRENT_ROOM_ERROR,
    payload: {error}
});

export const joinRoom = (roomId, password, peerData) => (dispatch, getState) => {
    //
    // const room = null;
    // dispatch(setCurrentRoom(room));
};

export const roomExitCleanup = () => (dispatch, getState) => {
    const state = getState();

    const socket = state.localUser.socket;
    const localSocketId = socket.id;
    if (socket) {
         const currentRoom = state.room.data;
         if (currentRoom.id) {
             socket.emit('leave', currentRoom.id);
             dispatch(setCurrentRoom({}));
         }
        socket.disconnect();
        dispatch(resetLocalUser());
    }

    const connections = state.connections.data;
    if (connections) {
        Object.values(connections).forEach(conn => conn.close());
    }

    const localStream = state.streams[localSocketId];
    if (localStream) {
        window.localStream.getTracks().forEach(track => track.stop());
    }
    dispatch(clearAllStreams());
};
