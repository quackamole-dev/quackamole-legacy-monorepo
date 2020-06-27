import {ADD_STREAM, REMOVE_STREAM, SET_STREAMS_ERROR, CLEAR_ALL_STREAMS} from '../actionTypes';
import {clearStreamTracks} from "../../utils";
import produce from 'immer'

const initialState = {
    data: {},
    error: null
};

const streamsReducer = produce((streamsDraft, action) => {
    switch (action.type) {
        case ADD_STREAM: {
            const {peerId, stream} = action.payload;
            streamsDraft.data[peerId] = stream;
            streamsDraft.error = null;
            return;
        }
        case REMOVE_STREAM: {
            const peerId = action.payload.peerId;
            const stream = streamsDraft.data[peerId];
            clearStreamTracks(stream);
            delete streamsDraft.data[peerId];
            return;
        }
        case SET_STREAMS_ERROR: {
            streamsDraft.error = null;
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
