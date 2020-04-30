import {SET_CALLS, SET_CONNECTIONS, SET_PEERS, SET_PEERS_ERROR} from '../actionTypes';

const initialState = {
    data: {
        'd7f7saim3': {nickname: 'Andi', peerId: 'dscdsv-csdvsdv-dvewvew-btrbrb3', connection: 'efewfgrger', call: 'fewfewfwef'},
        '32mfdnmio': {nickname: 'Jimmy', peerId: 'ztjzt-ckhjgvv-dvewvew-b3cddrv', connection: 'vverberberb', call: 'vewrverbe'}
    },
    error: null
};

const peersReducer = (peers = initialState, action) => {
    switch (action.type) {
        case SET_PEERS: {
            return {peers: action.payload.peers, error: null};
        }
        case SET_PEERS_ERROR: {
            return {data: peers.data, error: action.payload.error};
        }
        case SET_CONNECTIONS: {
            // TODO iterate through peers and reference their connection id
            return peers;
        }
        case SET_CALLS: {
            // TODO iterate through peers and reference their call id
            return peers;
        }
        default: {
            return peers;
        }
    }
};

export default peersReducer;

