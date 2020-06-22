import {ADD_STREAM, REMOVE_STREAM, SET_STREAMS_ERROR, CLEAR_ALL_STREAMS} from '../actionTypes';
import {clearStreamTracks} from "../../utils";

const initialState = {
    data: {},
    error: null
};

const streamsReducer = (streams = initialState, action) => {
    switch (action.type) {
        case ADD_STREAM: {
            const {peerId, stream} = action.payload;
            return {data: {...streams.data, [peerId]: stream}, error: null};
        }
        case REMOVE_STREAM: {
            const newData = {...streams.data};
            const peerId = action.payload.peerId;
            const stream = newData[peerId];
            clearStreamTracks(stream);
            delete newData[peerId];
            return {data: newData, error: null};
        }
        case SET_STREAMS_ERROR: {
            return {...streams, error: action.payload.error};
        }
        case CLEAR_ALL_STREAMS: {
            Object.values(streams.data).forEach(clearStreamTracks);
            return {...streams, data: {}, error: null};
        }
        // case REMOVE_CONNECTION: {
        //     const newData = {...streams.data};
        //     const peerId = action.payload.connection.peer;
        //     const stream = newData[peerId]
        //     clearStreamTracks(stream);
        //     delete newData[peerId];
        //     return {data: newData, error: null};
        // }
        default: {
            return streams;
        }
    }
};

export default streamsReducer;
