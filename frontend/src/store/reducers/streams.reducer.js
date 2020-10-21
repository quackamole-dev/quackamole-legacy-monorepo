import {ADD_STREAM, CLEAR_ALL_STREAMS, REMOVE_STREAM, SET_STREAMS_ERROR} from '../actionTypes';
import {clearStreamTracks} from '../../utils';
import produce from 'immer';

const initialState = {
  data: {},
  error: null
};

const streamsReducer = produce((streamsDraft, action) => {
  switch (action.type) {
    case ADD_STREAM: {
      const { socketId, stream } = action.payload;
      streamsDraft.data[socketId] = { stream };
      streamsDraft.error = null;
      return;
    }
    case REMOVE_STREAM: {
      const { socketId } = action.payload;
      const streamWrapper = streamsDraft.data[socketId];
      if (streamWrapper) {
        clearStreamTracks(streamWrapper.stream);
        delete streamsDraft.data[socketId];
      }
      return;
    }
    case SET_STREAMS_ERROR: {
      streamsDraft.error = action.payload.error;
      return;
    }
    case CLEAR_ALL_STREAMS: {
      Object.values(streamsDraft.data).forEach(clearStreamTracks);
      streamsDraft.data = {};
      streamsDraft.error = null;
      return;
    }
    default: {}
  }
}, initialState);

export default streamsReducer;
