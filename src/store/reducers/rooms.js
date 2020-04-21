import { ADD_ROOMS } from '../actionTypes';

const initialState = {
    'dummy-room-id': {
        id: 'dummy-room-id',
        name: 'Dummy Room',
        peers: [
            'd7f7saim3',
            '32mfdnmio',
            '09dssd78j',
            '89dsb87fv',
        ]
    }
};

const rooms = (rooms = initialState, action) => {
    switch (action.type) {
        case ADD_ROOMS: {
            return { ...rooms, ...action.payload };
        }
        default: {
            return rooms;
        }
    }
};

export default rooms;
