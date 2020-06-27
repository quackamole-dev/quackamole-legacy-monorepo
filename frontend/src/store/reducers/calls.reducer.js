import {ADD_CALL, REMOVE_CALL, SET_CALLS_ERROR} from '../actionTypes';
import produce from 'immer'

const initialState = {
    data: {},
    error: null
};

const callsReducer = produce((callsDraft, action) => {
    switch (action.type) {
        case ADD_CALL: {
            const call = action.payload.call;
            callsDraft.data[call.peer] = call;
            callsDraft.error = null;
            return;
        }
        case REMOVE_CALL: {
            const call = action.payload.call;
            delete callsDraft.data[call.peer];
            callsDraft.error = null;
            return;
        }
        case SET_CALLS_ERROR: {
            callsDraft.error = action.payload.error;
            return;
        }
        default: {}
    }
}, initialState);

export default callsReducer;
