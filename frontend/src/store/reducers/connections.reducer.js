import {ADD_CONNECTION, REMOVE_CONNECTION, SET_CONNECTIONS_ERROR} from '../actionTypes';
import produce from 'immer';

const initialState = {
    data: {},
    error: null
};

const connectionsReducer = produce((connectionsDraft, action) => {
    switch (action.type) {
        case ADD_CONNECTION: {
            const connection = action.payload.connection;
            connectionsDraft.data[connection.peer] =  connection;
            connectionsDraft.error = null;
            return;
        }
        case REMOVE_CONNECTION: {
            const connection = action.payload.connection;
            delete connectionsDraft.data[connection.peer];
            connectionsDraft.error = null;
            return;
        }
        case SET_CONNECTIONS_ERROR: {
            connectionsDraft.error = action.payload.error;
            return;
        }
        default: {}
    }
}, initialState);

export default connectionsReducer;
