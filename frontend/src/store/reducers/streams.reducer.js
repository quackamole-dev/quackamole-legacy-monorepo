import {ADD_LOCAL_STREAM, ADD_REMOTE_STREAM, REMOVE_REMOTE_STREAM, SET_STREAMS_ERROR} from '../actionTypes';

const initialState = {
    data: {},
    error: null
};

const localStream = null;

const remoteStreams = {

};

const streamsReducer = (streams = initialState, action) => {
    switch (action.type) {
        case ADD_LOCAL_STREAM: {
            const stream = action.payload.localStream;
            console.log('localStream-----------', stream);
            return streams;
            // return {data: {...streams.data, [connection.connectionId]: connection}, error: null};
        }
        case ADD_REMOTE_STREAM: {
            const connection = action.payload.connection;
            return {data: {...streams.data, [connection.connectionId]: connection}, error: null};
        }
        case REMOVE_REMOTE_STREAM: {
            const newData = {...streams.data};
            const connection = action.payload.connection;
            delete newData[connection.connectionId];
            return {data: newData, error: null};
        }
        case SET_STREAMS_ERROR: {
            return {...streams, error: action.payload.error};
        }
        default: {
            return streams;
        }
    }
};

export default streamsReducer;

