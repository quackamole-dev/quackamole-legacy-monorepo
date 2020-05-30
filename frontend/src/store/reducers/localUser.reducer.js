import {INIT_LOCAL_USER_SOCKET, INIT_LOCAL_USER_PEER, SET_LOCAL_USER_METADATA, SET_LOCAL_USER_ERROR} from '../actionTypes';
import {getPersistedData} from "../../utils";

const initialState = {
    peer: null,
    socket: null,
    metadata: getPersistedData('metadata'),
    error: null
};

const localUserReducer = (localPeer = initialState, action) => {
    switch (action.type) {
        case INIT_LOCAL_USER_SOCKET: {
            return {...localPeer, socket: action.payload.socket, error: null};
        }
        case INIT_LOCAL_USER_PEER: {
            return {...localPeer, peer: action.payload.peer, error: null};
        }
        case SET_LOCAL_USER_METADATA: {
            return {...localPeer, metadata: action.payload.metadata, error: null};
        }
        case SET_LOCAL_USER_ERROR: {
            return {...localPeer, error: action.payload.error}
        }
        default: {
            return localPeer;
        }
    }
};

export default localUserReducer;

