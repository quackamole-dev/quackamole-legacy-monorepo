import {ADD_CONNECTION, REMOVE_CONNECTION, SET_CONNECTIONS_ERROR} from '../actionTypes';

const initialState = {
    data: {},
    error: null
};

const connectionsReducer = (connections = initialState, action) => {
    switch (action.type) {
        case ADD_CONNECTION: {
            const connection = action.payload.connection;
            return {data: {...connections.data, [connection.connectionId]: connection}, error: null};
        }
        case REMOVE_CONNECTION: {
            const newData = {...connections.data};
            const connection = action.payload.connection;
            delete newData[connection.connectionId];
            return {data: newData, error: null};
        }
        case SET_CONNECTIONS_ERROR: {
            return {...connections, error: action.payload.error};
        }
        default: {
            return connections;
        }
    }
};

export default connectionsReducer;

