import {ADD_CONNECTION} from "../actionTypes";

const addConnectionAction = connection => ({
    type: ADD_CONNECTION,
    payload: {connection}
});

export const addConnection = connection => (dispatch, getState) => {
    if (connection.peer && connection.connectionId) {
        dispatch(addConnectionAction(connection));
    }
};
