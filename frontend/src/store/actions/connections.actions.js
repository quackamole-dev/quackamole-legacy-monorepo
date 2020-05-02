import {ADD_CONNECTION} from "../actionTypes";

export const addConnection = connection => ({
    type: ADD_CONNECTION,
    payload: {connection}
});
