import {ADD_STREAM, CLEAR_ALL_STREAMS, REMOVE_STREAM} from '../actionTypes';

export const addStream = (socketId, stream) => (dispatch, getState) => { // TODO no need for a thunk, rename to setStream & SET_STREAM
  if (stream) {
    dispatch({ type: ADD_STREAM, payload: { socketId, stream } });
  }
};

export const removeStream = (socketId) => (dispatch, getState) => { // TODO no need for a thunk
  if (socketId) {
    dispatch({ type: REMOVE_STREAM, payload: { socketId } });
  }
};

export const clearAllStreams = () => async (dispatch, getState) => {
  dispatch({ type: CLEAR_ALL_STREAMS });
};
