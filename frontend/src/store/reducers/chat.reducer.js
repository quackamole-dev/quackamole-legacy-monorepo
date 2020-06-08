import {ADD_NEW_MESSAGE} from '../actionTypes';

const initialState = [
];

const chatReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_NEW_MESSAGE: {
            return [...state, action.payload];
        }
        default: {
            return state;
        }
    }
};

export default chatReducer
