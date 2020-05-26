import {ADD_NEW_MESSAGE} from '../actionTypes';

const initialState = [
];

const chatReducer = (state = initialState, action) => {
    console.log(action.payload, 'chatreducer');
    console.log(state, 'initialstate');
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
