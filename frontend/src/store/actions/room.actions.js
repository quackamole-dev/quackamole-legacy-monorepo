import {SET_CURRENT_ROOM, SET_CURRENT_ROOM_ERROR} from "../actionTypes";

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
