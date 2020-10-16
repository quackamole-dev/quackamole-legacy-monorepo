import {ADD_NEW_MESSAGE} from '../actionTypes';
import produce from 'immer';

const initialState = [];

const chatReducer = produce((messagesDraft, action) => {
  switch (action.type) {
    case ADD_NEW_MESSAGE: {
      messagesDraft.push(action.payload);  // FIXME should be action.payload.message
      return;
    }
    default: {}
  }
}, initialState);

export default chatReducer;
