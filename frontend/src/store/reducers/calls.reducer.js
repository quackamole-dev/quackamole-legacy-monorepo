import {ADD_CALL, REMOVE_CALL, SET_CALLS_ERROR} from '../actionTypes';

const initialState = {
    data: {},
    error: null
};

const callsReducer = (calls = initialState, action) => {
    switch (action.type) {
        case ADD_CALL: {
            const call = action.payload.call;
            return {data: {...calls.data, [call.id]: call}, error: null};
        }
        case REMOVE_CALL: {
            const newData = {...calls.data};
            const call = action.payload.call;
            delete newData[call.id];
            return {data: newData, error: null};
        }
        case SET_CALLS_ERROR: {
            return {...calls, error: action.payload.error};
        }
        default: {
            return calls;
        }
    }
};

export default callsReducer;

