import {
    ADD_PEER,
    REMOVE_PEER,
    SET_PEERS_ERROR,
    ADD_CONNECTION,
    REMOVE_CONNECTION,
    ADD_CALL,
    REMOVE_CALL,
} from '../actionTypes';

const initialState = {
    data: {
        // 'd7f7saim3': {nickname: 'Andi', peerId: 'dscdsv-csdvsdv-dvewvew-btrbrb3', connection: 'efewfgrger', call: 'fewfewfwef'},
        // '32mfdnmio': {nickname: 'Jimmy', peerId: 'ztjzt-ckhjgvv-dvewvew-b3cddrv', connection: 'vverberberb', call: 'vewrverbe'}
    },
    error: null
};

const peersReducer = (peers = initialState, action) => {
    switch (action.type) {
        case ADD_PEER: {
            const peer = action.payload.peer;
            return {data: {...peers.data, [peer.id]: peer}, error: null};
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
        case ADD_CONNECTION: {
            return peers;
        }
        case REMOVE_CONNECTION: {
            return peers;
        }
        case ADD_CALL: {
            return peers;
        }
        case REMOVE_CALL: {
            return peers;
        }
        default: {
            return peers;
        }
    }
};

export default peersReducer;

