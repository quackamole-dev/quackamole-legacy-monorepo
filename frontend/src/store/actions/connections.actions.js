import {ADD_CONNECTION, REMOVE_CONNECTION} from "../actionTypes";

export const addConnection = connection => (dispatch, getState) => {
    if (connection.peer && connection.connectionId) {
        dispatch({
            type: ADD_CONNECTION,
            payload: {connection}
        });
    }
};

export const removeConnection = connection => (dispatch, getState) => {
    if (connection.connectionId) {
        dispatch({
            type: REMOVE_CONNECTION,
            payload: {connection}
        });
    }
};
