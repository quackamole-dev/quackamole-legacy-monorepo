import {ADD_PEER, REMOVE_PEER, SET_PEERS_ERROR} from '../actionTypes';

const initialState = {
    data: {
        // 'd7f7saim3': {nickname: 'Andi'},
        // '32mfdnmio': {nickname: 'Jimmy'}
    },
    error: null
};

const peersReducer = (peers = initialState, action) => {
    switch (action.type) {
        case ADD_PEER: {
            const {peerId, metadata} = action.payload;
            return {data: {...peers.data, [peerId]: {metadata}}, error: null};
        }
        case REMOVE_PEER: {
            const newData = {...peers.data};
            const peer = action.payload.peer;
            delete newData[peer.id];
            return {data: newData, error: null};
        }
        case SET_PEERS_ERROR: {
            return {...peers, error: action.payload.error};
        }
        default: {
            return peers;
        }
    }
};

export default peersReducer;

