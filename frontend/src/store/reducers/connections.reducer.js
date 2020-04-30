import {SET_CONNECTIONS, SET_CONNECTIONS_ERROR} from '../actionTypes';

const initialState = {
    data: {},
    error: null
};

const connectionsReducer = (connections = initialState, action) => {
    switch (action.type) {
        case SET_CONNECTIONS: {
            return {connections: action.payload.connections, error: null};
        }
        case SET_CONNECTIONS_ERROR: {
            return {data: connections.data, error: action.payload.error};
        }
        default: {
            return connections;
        }
    }
};

export default connectionsReducer;

