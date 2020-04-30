import {SET_CALLS, SET_CALLS_ERROR} from '../actionTypes';

const initialState = {
    data: {},
    error: null
};

const callsReducer = (calls = initialState, action) => {
    switch (action.type) {
        case SET_CALLS: {
            return {calls: action.payload.calls, error: null};
        }
        case SET_CALLS_ERROR: {
            return {data: calls.data, error: action.payload.error};
        }
        default: {
            return calls;
        }
    }
};

export default callsReducer;

