import { combineReducers } from 'redux';
import roomReducer from './room.reducer';
import peersReducer from './peers.reducer';
import connectionsReducer from './connections.reducer';
import callsReducer from './calls.reducer';

const reducer = combineReducers({
    room: roomReducer,
    peers: peersReducer,
    calls: callsReducer,
    connections: connectionsReducer
});

export default reducer;
