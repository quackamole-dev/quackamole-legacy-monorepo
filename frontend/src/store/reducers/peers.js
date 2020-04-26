import { ADD_PEERS, CLEAR_PEERS } from '../actionTypes';

const initialState = {
    'd7f7saim3': {nickname: 'Andi'},
    '32mfdnmio': {nickname: 'Jimmy'},
    '09dssd78j': {nickname: 'Derp1'},
    '89dsb87fv': {nickname: 'Derp2'},
};

const peers = (peers = initialState, action) => {
    switch (action.type) {
        case ADD_PEERS: {
            return { ...peers, ...action.payload };
        }
        case CLEAR_PEERS: {
            return {};
        }
        default: {
            return peers;
        }
    }
};

export default peers;
