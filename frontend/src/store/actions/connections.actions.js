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
    // FIXME check if connection really gets garbage collected if there are no references.
    //  I remember reading that browsers keep them around. If that is the case delete them manually in this thunk
    if (connection.connectionId) {
        console.log('remove connection action', connection);
        dispatch({
            type: REMOVE_CONNECTION,
            payload: {connection}
        });
    }
};
