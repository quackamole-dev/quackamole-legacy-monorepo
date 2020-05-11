import {SET_STREAM, SET_STREAMS_ERROR} from '../actionTypes';

const initialState = {
    data: {},
    error: null
};

const streamsReducer = (streams = initialState, action) => {
    switch (action.type) {
        case SET_STREAM: {
            const {peerId, isActive} = action.payload;
            return {data: {...streams.data, [peerId]: isActive}, error: null};
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
