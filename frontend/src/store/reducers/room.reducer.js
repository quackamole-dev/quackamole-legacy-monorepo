import {SET_CURRENT_ROOM, SET_CURRENT_ROOM_ERROR} from '../actionTypes';

const initialState = {
    data: {
        // id: 'dummy-room-id',
        // name: 'Dummy Room',
    },
    error: null
};

const roomReducer = (room = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_ROOM: {
            return {data: action.payload.room, error: null};
        }
        case SET_CURRENT_ROOM_ERROR: {
            return {data: room.data, error: action.payload.error};
        }
        default: {
            return room;
        }
    }
};

export default roomReducer;
